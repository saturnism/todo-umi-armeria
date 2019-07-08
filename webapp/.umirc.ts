import { IConfig } from 'umi-types';
import {Configuration} from "webpack";
import * as path from "path";
// ref: https://umijs.org/config/
const config: IConfig =  {
  proxy: {
    "/com.example.todo.TodoService": {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
  treeShaking: true,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: false,
      title: 'okta-umi',
      dll: true,
      locale: {
        enable: true,
        default: 'en-US',
      },
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
          /generated\//,
        ],
      },
    }],
  ],
  theme: {
    "layout-body-background": "white",
    "layout-header-background": "white",
  },
}

export default config;
