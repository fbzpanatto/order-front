import { animate, state, style, transition, trigger } from "@angular/animations";

export const UserMenuAnimation = trigger('conditionalTrigger', [
  state('void',
    style({
      transform: 'translateY(-5%)'
    })),
  state('shown',
    style({
      transform: 'translateY(0)'
    })),
  transition('shown <=> void', [animate('100ms ease-in')])
])