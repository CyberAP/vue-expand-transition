import { ExpandTransition } from "./ExpandTransition";

export default ExpandTransition;

declare const Vue: any

if (typeof window !== 'undefined') {
  Vue.component('ExpandTransition', ExpandTransition);
}