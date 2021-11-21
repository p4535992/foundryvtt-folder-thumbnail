import { FOLDER_THUMBNAIL_MODULE_NAME } from './settings';

export const preloadTemplates = async function () {
  const templatePaths = [
    // Add paths to "modules/foundryvtt-riddle-one/templates"
    `modules/${FOLDER_THUMBNAIL_MODULE_NAME}/templates/folder-thumbnail-edit.html`,
  ];
  return loadTemplates(templatePaths);
};
