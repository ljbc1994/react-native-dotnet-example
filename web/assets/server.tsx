import React from 'react';
import {Provider} from 'react-redux';
import fs from 'fs';
import path from 'path';
import ReactDOMServer from 'react-dom/server';
import {AppRegistry} from 'react-native-web';
import serialize from 'serialize-javascript';
import {ServerContainer} from '@react-navigation/native';
import {setupStore} from '../../src/state/store';
import App from '../../src/App';
import config from '../webpack/config';

type RenderResult = {
  html: string | null;
  status: number;
  redirect?: string | null;
};

type RenderView<TModel, TViewBag, TRouteValues> = (
  callback: (error: Error | null, result: RenderResult) => void,
  _path: string,
  model: TModel,
  viewBag: TViewBag,
  routeValues: TRouteValues,
) => void;

export const renderView: RenderView<{}, {}, {}> = (
  callback,
  _path,
  model,
  viewBag,
  routeValues,
) => {
  const result: RenderResult = {
    html: null,
    status: 404,
    redirect: null,
  };

  const location = {pathname: _path, search: ''};

  try {
    AppRegistry.registerComponent('App', () => App);

    const {element, getStyleElement} = AppRegistry.getApplication('App');

    const store = setupStore({
      preloadedState: model,
    });

    const appHtml = ReactDOMServer.renderToString(
      <ServerContainer location={location}>
        <Provider store={store}>{element}</Provider>
      </ServerContainer>,
    );

    if (viewBag != null) {
      store.dispatch({type: '_HYDRATE_VIEWBAG', payload: viewBag});
    }

    const css = ReactDOMServer.renderToStaticMarkup(getStyleElement());

    const html = fs
      .readFileSync(path.join(config.templateDistPath, 'index.html'), 'utf8') // cache that ish?
      .replace('__APP__', appHtml)
      .replace('__CSS__', css)
      .replace('__STATE__', serialize(store.getState()));

    result.html = html;
    result.status = 200;

    callback(null, result);
  } catch (ex) {
    result.status = 500;
    callback(ex, result);
  }
};
