import { animate, state, style, transition, trigger } from "@angular/animations";

export const ConditionAnimation = trigger('conditionalTrigger', [
  state('void', style({
    transform: 'translateX(-120%)'
  })),
  state('open', style({ transform: 'translateX(0)' })),
  transition('shown <=> void', [animate('100ms ease-in')])
])