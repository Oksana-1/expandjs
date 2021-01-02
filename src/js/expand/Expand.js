import Target from "./Target";
import Trigger from "./Trigger";

const Expand = {
  trigger: null,
  targets: null,
  busy: false,
  openCloseHandler() {
    if (this.busy) return;
    if (!this.targets) return;
    this.busy = true;
    const openTargetsPromises = [];
    const closeSiblingsPromises = [];
    this.targets.forEach((target) => {
      const siblings = target.getSiblings();
      const isOpened = target.checkIsOpened();
      if (isOpened) {
        this.trigger.makeInactive();
        openTargetsPromises.push(target.close());
      } else {
        this.trigger.makeActive();
        openTargetsPromises.push(target.open());
        if (siblings) {
          siblings.forEach((sibling) => {
            this.busy = true;
            const siblingTarget = Object.create(Target);
            siblingTarget.setTargetElement(sibling);
            const siblingsTriggers = siblingTarget.getTriggers();
            siblingsTriggers.forEach((siblingsTrigger) => {
              siblingsTrigger.makeInactive();
            });
            closeSiblingsPromises.push(siblingTarget.close());
          });
        }
      }
    });
    Promise.allSettled([...openTargetsPromises, ...closeSiblingsPromises]).then(
      () => {
        this.busy = false;
      }
    );
  },
  setDefaultState() {
    if (!this.targets) return;
    this.targets.forEach((target) => {
      const defaultState =
        target.element.getAttribute("data-default-state") || null;
      if (!defaultState) return;
      if (defaultState === "opened") {
        this.trigger.makeActive();
        target.show();
      } else if (defaultState === "closed") {
        this.trigger.makeInactive();
        target.hide();
      }
    });
  },
  setTrigger(trigger) {
    const expandTrigger = Object.create(Trigger);
    expandTrigger.setTriggerElement(trigger);
    this.trigger = expandTrigger;
  },
  setTargets() {
    this.targets = this.trigger.getTargets();
  },
  init(element) {
    if (!element) return;
    this.setTrigger(element);
    this.setTargets();
    this.setDefaultState();
  },
};
export const ExpandHandler = {
  listen(event) {
    const triggers = document.querySelectorAll("[data-expand]") || null;
    if (!triggers) return;
    triggers.forEach((trigger) => {
      const expand = Object.create(Expand);
      expand.init(trigger);
      trigger.addEventListener(event, (e) => {
        e.preventDefault();
        expand.openCloseHandler();
      });
    });
  },
};
