import { onRequestPost as __api_upload_js_onRequestPost } from "D:\\Ahmed\\Documents\\resturant menu\\functions\\api\\upload.js"
import { onRequest as __api_upload_js_onRequest } from "D:\\Ahmed\\Documents\\resturant menu\\functions\\api\\upload.js"

export const routes = [
    {
      routePath: "/api/upload",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_upload_js_onRequestPost],
    },
  {
      routePath: "/api/upload",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_upload_js_onRequest],
    },
  ]