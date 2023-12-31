import { configFTP } from "../config/ftp.js";
import vinylFTP from "vinyl-ftp";
import util from "gulp-util";

export const deployJs = () => {
  configFTP.log = util.log;
  const ftpConnect = vinylFTP.create(configFTP);

  return app.gulp
    .src(`${app.path.buildFolder}/**/js.*`, {})
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: "FTP",
          message: "Error: <%= error.message %>",
        })
      )
    )
    .pipe(ftpConnect.dest(`/${app.path.ftp}/public_html/assets/template/js/app.min.js`));
};
/* http://neweuarasia.webtm.ru/assets/template/js/app.min.js */