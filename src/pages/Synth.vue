<script setup>
import { computed, watch, ref, isRef } from "vue";
import { differenceInMilliseconds } from "date-fns";
import { Circle, Polygon, Result } from "collisions";
import * as Tone from "tone";
import { debouncedWatch } from "@vueuse/core";

import {
  ws,
  createMessage,
  debounce,
  config,
  users,
  userId,
  useWindow,
  scale,
  userName,
  userAbout,
  userData,
  onUserNameChange,
  useAboutTextarea,
  emitter,
  showMessages,
  pol2car,
  distance,
  replace,
  range,
} from "../lib";

// function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
//   var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

//   return {
//     x: centerX + radius * Math.cos(angleInRadians),
//     y: centerY + radius * Math.sin(angleInRadians),
//   };
// }

const arc = (startAngle, endAngle, radius) => {
  var start = pol2car(endAngle, radius);
  var end = pol2car(startAngle, radius);

  const arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

  const d = [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    arcSweep,
    0,
    end.x,
    end.y,
  ].join(" ");

  return d;
};

const props = defineProps({
  about: { type: Boolean, default: true },
});

emitter.on("USERS_ON", () => {
  showMessages.value = true;
});

emitter.on("USERS_OFF", () => {
  showMessages.value = false;
});

emitter.emit("USERS_ON");

const updatedUsers = computed(() =>
  users.value
    .map((user) => {
      user.updatedSince = differenceInMilliseconds(
        new Date(),
        new Date(user.datetime)
      );
      user.opacity = Math.min(
        0.8,
        scale(user.updatedSince, 0, config.userUpdatedSinceLimit, 1, 0.1)
      );
      return user;
    })
    .filter((user) => user.updatedSince < config.userUpdatedSinceLimit)
    .sort((a, b) => a.userId.localeCompare(b.userId))
);

const otherUsers = computed(() =>
  updatedUsers.value
    .filter(
      (user) =>
        user.userId !== userId.value && user.value.userX && user.value.userY
    )
    .sort((a, b) => a.userId > b.userId)
);

const { centerX, centerY } = useWindow();

const onLocalDrag = ({ x, y }) => {
  userData.value = { userX: x - centerX.value, userY: y - centerY.value };
};
const onRemoteDrag = debounce(({ x, y }) => {
  const outgoingMessage = createMessage({
    type: "USER",
    value: {
      userX: x - centerX.value,
      userY: y - centerY.value,
      userName: userName.value,
      userAbout: userAbout.value,
    },
  });
  ws.send(outgoingMessage);
}, config.messageDelay);

const otherUserStyle = (otherUser) =>
  computed(() => ({
    left: `${otherUser.value.userX + centerX.value}px`,
    top: `${otherUser.value.userY + centerY.value}px`,
  }));

const textareaRef = useAboutTextarea(showMessages);

const circle = new Circle(0, 0, 100);
const circle2 = new Circle(-200, -200, 50);
const myCircle = new Circle(userData.value.userX, userData.value.userY, 10);
const result = new Result();
const result2 = new Result();

const colliding = computed(() => {
  myCircle.x = userData.value.userX;
  myCircle.y = userData.value.userY;
  return !!myCircle.collides(circle, result);
});

const colliding2 = computed(() => {
  myCircle.x = userData.value.userX;
  myCircle.y = userData.value.userY;
  return !!myCircle.collides(circle2, result2);
});

const a = ref(0);
const started = ref(false);

const onStart = () => {
  Tone.start().then(() => {
    started.value = true;
    new Tone.Loop((time) => {
      Tone.Draw.schedule(() => {
        a.value = time * 60 * 1;
      });
    }, 1 / 60).start(0);
    Tone.Transport.start();
    p.start();
    p2.start();
    sampler.toDestination();
  });
};

const onStop = () => {
  Tone.Transport.cancel();
  p.stop();
  p2.stop();
  sampler.disconnect();
  started.value = false;
};

const linePos = computed(() => pol2car(a.value, 250));

const feedbackDelay = new Tone.FeedbackDelay("16n", 0.1).toDestination();

const tom = new Tone.MonoSynth({}).connect(feedbackDelay);

const colliding3 = ref(false);

const userColliding = ref({});

const samplerLoaded = ref(false);
const samplerLoaded2 = ref(false);

const sampler = new Tone.Sampler({
  urls: {
    A1: "floaty01.mp3",
  },
  baseUrl: "https://elektron.fra1.digitaloceanspaces.com/assets/",
  attack: 0.1,
  decay: 0.2,
  sustain: 1,
  release: 1,
  volume: 10,
  onload: () => (samplerLoaded.value = true),
})
  .connect(new Tone.Reverb(1))
  .toDestination();

const filter = new Tone.Filter(20000, "highpass");

const filterOsc = new Tone.Oscillator({
  volume: 0,
  type: "sine",
  frequency: "E4",
}).connect(filter);

const p = new Tone.GrainPlayer({
  url: "https://elektron.fra1.digitaloceanspaces.com/assets/passageDrums01.mp3",
  loop: true,
  grainSize: 0.1,
  overlap: 0.01,
  reverse: false,
  volume: 0.1,
  playbackRate: 0.1,
  // detune: -1000,
  //loopStart: "20n",
})
  //.connect(filter)
  //.connect(feedbackDelay)
  .connect(new Tone.Reverb(10))
  .toDestination();

const p2 = new Tone.GrainPlayer({
  url: "https://elektron.fra1.digitaloceanspaces.com/assets/passageDrums01.mp3",
  loop: true,
  grainSize: 1,
  overlap: 2,
  reverse: false,
  volume: 0.1,
  // detune: -1000,
  loopEnd: "2n",
  mute: true,
})
  .connect(filter)
  .connect(feedbackDelay)
  .connect(new Tone.Reverb(10))
  .toDestination();

const circlesR = 300;
const circlesRange = 100;

const circles = range(0, circlesRange, 5).map((a) =>
  pol2car(a - circlesRange / 2, circlesR)
);

const cColl = ref([]);
const cColl2 = ref([]);

const average = (arr) => {
  const avg = arr.reduce((p, c) => p + c, 0) / arr.length;
  return avg || null;
};

watch(cColl, () => {
  if (cColl.value) {
    p.mute = false;
    //p2.mute = false;
    //filter.frequency.rampTo(1000000 - cColl.value * 10000, 10);
    if (cColl.value < 2) {
      p.reverse = true;
    } else {
      p.reverse = false;
    }
    //
    p.grainSize = cColl.value * 0.5;
    p.detune = cColl.value * 100 - 1000;
    p2.detune = cColl.value * 100;
    p.playbackRate = cColl.value * 2;

    //p.loopEnd = Math.minscale(cColl.value, 0, 21, 0, 2.5);
  } else {
    p.mute = true;
    p2.mute = true;
  }
});

// debouncedWatch(
//   cColl,
//   () => {
//     if (cColl.value) {
//       const hz = scale(cColl.value, 1, 31, 50, 300);
//       if (samplerLoaded2.value) {
//         p2.triggerAttackRelease(`${hz}hz`, "1n");
//       }
//     }
//   },
//   { immediate: true, debounce: 1000 }
// );

watch(
  [userData, otherUsers, a],
  () => {
    const lineColl = new Polygon(0, 0, [
      [0, 0],
      [0, 0],
      [linePos.value.x, linePos.value.y],
      [linePos.value.x, linePos.value.y],
    ]);

    const d = distance(0, 0, userData.value.userX, userData.value.userY);
    const r = scale(d, 0, 250, 2, 15);
    const myColl = new Circle(userData.value.userX, userData.value.userY, r);

    const coll = myColl.collides(lineColl, new Result());

    const hz = scale(d, -250, 250, 100, 10);

    if (coll && samplerLoaded.value) {
      sampler.triggerAttackRelease(`${hz}hz`, 10);
    }

    userColliding.value = {
      ...userColliding.value,
      [userId.value]: { colliding: !!coll, distance: d },
    };

    otherUsers.value.forEach((u) => {
      const d = distance(0, 0, u.value.userX, u.value.userY);
      const r = scale(d, 0, 250, 2, 15);
      const userColl = new Circle(u.value.userX, u.value.userY, r);
      const coll = userColl.collides(lineColl, new Result());
      if (coll && samplerLoaded.value) {
        const hz = scale(d, -250, 250, 100, 10);
        sampler.triggerAttackRelease(`${hz}hz`, 10);
      }
      userColliding.value = {
        ...userColliding.value,
        [userId]: { colliding: !!coll, distance: d },
      };
    });

    cColl.value = average(
      [userData.value, ...otherUsers.value]
        .map((u) => {
          const uCircle = new Circle(
            u.userX || u.value?.userX,
            u.userY || u.value?.userY
          );
          const cCollisions = circles
            .map((c, i) => new Circle(c.x, c.y, 20))
            .map((c, i) => {
              return c.collides(uCircle) ? i + 1 : null;
            });
          return cCollisions;
        })
        .flat()
        .filter((v) => v)
    );
  },
  { immediate: true, debounce: 200 }
);
</script>

<template>
  <div>
    <svg
      width="700"
      height="700"
      viewBox="-350 -350 700 700"
      style="position: fixed"
      :style="{ top: centerY - 350 + 'px', left: centerX - 350 + 'px' }"
    >
      <circle
        :r="250 - 1"
        cx="0"
        cy="0"
        stroke="#777"
        stroke-width="2"
        fill="none"
      />
      <!-- <circle
        v-for="(c, i) in circles"
        :key="i"
        r="10"
        :cx="c.x"
        :cy="c.y"
        stroke="#777"
        stroke-width="2"
        fill="none"
      /> -->
      <path
        :d="arc(circlesRange / -2, circlesRange / 2, circlesR)"
        stroke="#777"
        stroke-width="2"
        fill="none"
      />
      <path
        :d="
          arc(
            circlesRange / -2,
            scale(cColl, 0, 21, circlesRange / -2, circlesRange / 2),
            circlesR
          )
        "
        stroke="white"
        stroke-width="2"
        fill="none"
      />
      <g v-for="(user, i) in userColliding" :key="i">
        <transition name="fade-long">
          <circle
            v-if="user.colliding"
            :r="user.distance"
            cx="0"
            cy="0"
            stroke="white"
            stroke-width="2"
            fill="none"
            opacity="0.1"
          />
        </transition>
      </g>
      <line :x2="linePos.x" :y2="linePos.y" stroke="white" stroke-width="2" />
    </svg>
    <br />
    <transition name="fade">
      <vertical v-show="showMessages" class="about-panel">
        <button-big
          v-if="!started"
          style="justify-self: stretch"
          @click="onStart"
        >
          Start music
        </button-big>
        <button-big
          v-if="started"
          style="justify-self: stretch"
          @click="onStop"
        >
          Stop music
        </button-big>

        <small>
          <span style="opacity: 0.5">Your name is {{ userName }}</span
          >&ensp;
          <span @click="onUserNameChange" style="cursor: pointer"
            >Change the name</span
          >
        </small>
        <textarea
          ref="textareaRef"
          v-model="userAbout"
          placeholder="Write here a message"
          style="
            padding: 4px 8px;
            background: none;
            font-size: 0.8em;
            width: 100%;
          "
        />
      </vertical>
    </transition>
    <div
      v-for="otherUser in otherUsers"
      :key="otherUser.userId"
      :style="{
        ...otherUserStyle(otherUser).value,
        position: 'fixed',
        transition: 'all ' + config.messageDelay * 10 + 'ms linear',
      }"
    >
      <div style="display: grid; grid-template-columns: auto 300px; gap: 8px">
        <div
          style="animation-delay: 20ms"
          trans
          :style="{
            animation: userColliding[otherUser.userId]?.colliding
              ? 'move 1000ms ease'
              : '',
          }"
        >
          <dot
            color="#8800FF"
            style="transition: opacity 1000ms"
            :opacity="showMessages ? 1 : otherUser.opacity / 2"
          />
        </div>
        <transition name="fade">
          <div v-if="showMessages">
            <div
              style="
                font-size: 0.8em;
                opacity: 0.5;
                line-height: 1.3em;
                padding-top: 0.5em;
              "
            >
              {{ otherUser.value.userName }}
            </div>
            <div
              style="font-size: 0.9em; line-height: 1.5em; padding-top: 0.3em"
            >
              {{ otherUser.value.userAbout }}
            </div>
          </div>
        </transition>
      </div>
    </div>

    <draggable
      :x="userData.userX + centerX"
      :y="userData.userY + centerY"
      @drag="
        (drag) => {
          onLocalDrag(drag);
          onRemoteDrag(drag);
        }
      "
    >
      <div style="display: grid; grid-template-columns: auto 250px; gap: 8px">
        <div
          style="animation-delay: 20ms"
          trans
          :style="{
            animation: colliding3 ? 'move 1000ms ease' : '',
          }"
        >
          <dot color="red" opacity="0.8" />
        </div>
        <transition name="fade">
          <div v-if="showMessages">
            <div
              style="
                font-size: 0.8em;
                opacity: 0.5;
                line-height: 1.3em;
                padding-top: 0.3em;
              "
            >
              {{ userName }}
            </div>
            <div
              style="font-size: 0.9em; line-height: 1.5em; padding-top: 0.3em"
            >
              {{ userAbout }}
            </div>
          </div>
        </transition>
      </div>
    </draggable>
  </div>
</template>

<style>
.about-panel {
  position: fixed;
  left: 16px;
  bottom: 16px;
  padding: 16px;
  background: var(--bglight);
  border-radius: 6px;
  display: grid;
  grid-auto-rows: max-height;
  gap: 8px;
  width: 300px;
}
@media (max-width: 800px) {
  .about-panel {
    width: calc(100vw - 16px - 16px);
  }
  .mobilehide {
    display: none;
  }
}
</style>
