import { warn, error, debug, i18n } from '../foundryvtt-folder-thumbnail';
import { FolderThumbnailEditConfig } from './FolderThumbnailEditConfig';
import { FOLDER_THUMBNAIL_MODULE_NAME, getGame } from './settings';

export const readyHooks = async () => {
  Hooks.on('renderActorDirectory', async function (args) {
    //
  });

  Hooks.on('renderItemDirectory', async function (args) {
    //
  });

  Hooks.on('renderJournalDirectory', async function (args) {
    //
  });

  Hooks.on('renderPlaylistDirectory', async function (args) {
    //
  });

  Hooks.on('renderRollTableDirectory', async function (args) {
    //
  });

  Hooks.on('renderSceneDirectory', async function (args) {
    //
  });

  Hooks.on('renderMacroDirectory', async function (args) {
    //
  });
};

export const setupHooks = async () => {
  // setup all the hooks

  // Adding export buttons to context menus for folders
  const newContextOption = {
    name: 'FOLDER.Edit',
    icon: '<i class="fas fa-edit"></i>',
    condition: getGame().user?.isGM,
    callback: (header) => {
      const li = header.parent()[0];
      const folder = <Folder>getGame().folders?.get(li.dataset.folderId);
      const options = {
        top: li.offsetTop,
        left: window.innerWidth - 310 - <number>FolderConfig.defaultOptions.width,
      };
      new FolderThumbnailEditConfig(folder, options).render(true);
    },
  }

  //@ts-ignore
  const oldActorFolderCtxOptions = ActorDirectory.prototype._getFolderContextOptions
  //@ts-ignore
  ActorDirectory.prototype._getFolderContextOptions = () => oldActorFolderCtxOptions().concat(newContextOption);

  //@ts-ignore
  const oldItemFolderCtxOptions = ItemDirectory.prototype._getFolderContextOptions
  //@ts-ignore
  ItemDirectory.prototype._getFolderContextOptions = () => oldItemFolderCtxOptions().concat(newContextOption);

  //@ts-ignore
  const oldJournalFolderCtxOptions = JournalDirectory.prototype._getFolderContextOptions
  //@ts-ignore
  JournalDirectory.prototype._getFolderContextOptions = () => oldJournalFolderCtxOptions().concat(newContextOption);

  //@ts-ignore
  const oldRollTableFolderCtxOptions = RollTableDirectory.prototype._getFolderContextOptions
  //@ts-ignore
  RollTableDirectory.prototype._getFolderContextOptions = () => oldRollTableFolderCtxOptions().concat(newContextOption);

  //@ts-ignore
  const oldSceneFolderCtxOptions = SceneDirectory.prototype._getFolderContextOptions
  //@ts-ignore
  SceneDirectory.prototype._getFolderContextOptions = () => oldSceneFolderCtxOptions().concat(newContextOption);

  // //@ts-ignore
  // libWrapper.register(
  //   FOLDER_THUMBNAIL_MODULE_NAME,
  //   'SceneDirectory.prototype._getFolderContextOptions',
  //   SceneDirectoryPrototypeGetFolderContextOptions,
  //   'MIXED',
  // );
};

export const initHooks = () => {
  warn('Init Hooks processing');

};


export const SceneDirectoryPrototypeGetFolderContextOptions = async function (wrapped, ...args) {
  //@ts-ignore
  // const options = SidebarDirectory.prototype._getFolderContextOptions.call(this);
  const [options] = args;
  return [
    {
      name: 'FOLDER.Edit',
      icon: '<i class="fas fa-edit"></i>',
      condition: getGame().user?.isGM,
      callback: (header) => {
        const li = header.parent()[0];
        const folder = <Folder>getGame().folders?.get(li.dataset.folderId);
        const options = {
          top: li.offsetTop,
          left: window.innerWidth - 310 - <number>FolderConfig.defaultOptions.width,
        };
        new FolderThumbnailEditConfig(folder, options).render(true);
      },
    },
  ].concat(options);
};