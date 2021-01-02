const Trigger = {
  element: null,
  isActive: false,
  setTriggerElement(trigger) {
    this.element = trigger;
  },
  makeActive() {
    if (!this.element) return;
    this.element.classList.add("active");
    this.isActive = true;
  },
  makeInactive() {
    if (!this.element) return;
    this.element.classList.remove("active");
    this.isActive = false;
  },
};
export default Trigger;
