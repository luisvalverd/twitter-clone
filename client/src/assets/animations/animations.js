import anime from "animejs";

export function likeAnimation(element) {
  anime({
    targets: element,
    keyframes: [{ translateY: -5 }, { translateY: 0 }],
    duration: 600,
    rotate: ["360deg", "0deg"],
    endDelay: 1000,
    direction: "alternate",
    loop: false,
  });
}
