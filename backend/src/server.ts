import { serverHttp } from "./app";

serverHttp.listen(3333, () =>
  console.log(`\nServer is running on PORT 3333`)
);
