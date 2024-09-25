import { ReactElement } from "react";

import { AnimationType, OverlayType } from "../overlay";

export type CreateElementFunction<P> = (props: P) => ReactElement;

export class OverlayModalConfig {
  constructor(
    type: OverlayType = "Modal",
    background: string = "bg-black bg-opacity-30",
    animation: AnimationType = "Bounce",
    closeOnClickOut: boolean = true
  ) {
    this.type = type;
    this.background = background;
    this.animation = animation;
    this.closeOnClickOut = closeOnClickOut;
  }

  type: OverlayType;
  background: string;
  animation: AnimationType;
  closeOnClickOut: boolean;
}

export class OverlayItem<P> {
  constructor(element: CreateElementFunction<P>, props: P, config: OverlayModalConfig, isVisible: boolean = true,onClosed?: ()=>void,onClickOut?: ()=>void) {
    this.element = element;
    this.props = props;
    this.config = config;
    this.isVisible = isVisible;
    this.onClosed = onClosed;
    this.onClickOut = onClickOut;
  }

  element: CreateElementFunction<P>;
  props: P;
  id: string = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  isVisible: boolean;
  config: OverlayModalConfig;
  onClosed?: ()=>void;
  onClickOut?: ()=>void;

  withVisibility(isVisible: boolean): OverlayItem<P> {
    var newOverlay = new OverlayItem(this.element, this.props, this.config, isVisible);
    newOverlay.id = this.id;
    return newOverlay;
  }

  withProps(props: P){
    var newOverlay = new OverlayItem(this.element, props, this.config, this.isVisible);
    newOverlay.id = this.id;
    return newOverlay;
  }
}
