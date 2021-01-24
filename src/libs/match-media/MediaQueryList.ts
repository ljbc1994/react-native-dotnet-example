import mediaQuery from 'css-mediaquery';
import {Dimensions} from 'react-native';

type Listener = (context: MediaQueryList) => any;

export default class MediaQueryList /* extends MediaQueryList */ {
  private listeners: Listener[] = [];

  constructor(private query: string) {
    Dimensions.addEventListener('change', this.resize);
  }

  private resize = () => {
    this.updateListeners();
  };

  _unmount() {
    Dimensions.removeEventListener('change', this.resize);
  }

  public addListener(listener: Listener) {
    this.listeners.push(listener);
  }

  public removeListener(listener: Listener) {
    const index = this.listeners.indexOf(listener);
    if (index !== -1) this.listeners.splice(index, 1);
  }

  public get matches(): boolean {
    const windowDimensions = Dimensions.get('window');
    return mediaQuery.match(this.query, {
      type: 'screen',
      ...windowDimensions,
      'device-width': windowDimensions.width,
      'device-height': windowDimensions.height,
    });
  }

  private updateListeners() {
    this.listeners.forEach((listener) => {
      listener(this);
    });
  }
}
