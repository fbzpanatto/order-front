import { animate, state, style, transition, trigger } from "@angular/animations";

export const AsideConditionAnimation = trigger('conditionalTrigger', [
  state('void', style({
    transform: 'translateX(-120%)'
  })),
  state('shown', style({ transform: 'translateX(0)' })),
  transition('shown <=> void', [animate('100ms ease-in')])
])