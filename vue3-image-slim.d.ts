import { DefineComponent, Plugin } from 'vue';

declare const Vue3ImageSlim: DefineComponent<{}, {}, any> & { install: Exclude<Plugin['install'], undefined> };
export default Vue3ImageSlim;
