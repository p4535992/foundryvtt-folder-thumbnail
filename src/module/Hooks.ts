import { warn, error, debug, i18n } from '../foundryvtt-folder-thumbnail';
import { FolderThumbnailEditConfig } from './FolderThumbnailEditConfig';
import { FOLDER_THUMBNAIL_MODULE_NAME, getGame } from './settings';

export const readyHooks = async () => {
  //
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
  };

  //@ts-ignore
  const oldActorFolderCtxOptions = ActorDirectory.prototype._getFolderContextOptions;
  //@ts-ignore
  ActorDirectory.prototype._getFolderContextOptions = () => oldActorFolderCtxOptions().concat(newContextOption);

  //@ts-ignore
  const oldItemFolderCtxOptions = ItemDirectory.prototype._getFolderContextOptions;
  //@ts-ignore
  ItemDirectory.prototype._getFolderContextOptions = () => oldItemFolderCtxOptions().concat(newContextOption);

  //@ts-ignore
  const oldJournalFolderCtxOptions = JournalDirectory.prototype._getFolderContextOptions;
  //@ts-ignore
  JournalDirectory.prototype._getFolderContextOptions = () => oldJournalFolderCtxOptions().concat(newContextOption);

  //@ts-ignore
  const oldRollTableFolderCtxOptions = RollTableDirectory.prototype._getFolderContextOptions;
  //@ts-ignore
  RollTableDirectory.prototype._getFolderContextOptions = () => oldRollTableFolderCtxOptions().concat(newContextOption);

  //@ts-ignore
  const oldSceneFolderCtxOptions = SceneDirectory.prototype._getFolderContextOptions;
  //@ts-ignore
  SceneDirectory.prototype._getFolderContextOptions = () => oldSceneFolderCtxOptions().concat(newContextOption);

  // //@ts-ignore
  // libWrapper.register(
  //   FOLDER_THUMBNAIL_MODULE_NAME,
  //   'SceneDirectory.prototype._getFolderContextOptions',
  //   SceneDirectoryPrototypeGetFolderContextOptions,
  //   'MIXED',
  // );

  Hooks.on('renderActorDirectory', async function (app, html: JQuery<HTMLElement>) {
    // $('.sidebar-tab').each(function() {
    // const list = $(this).find('.directory-list');
    const list = html.find('.directory-list');
    if (list.length) {
      list.children().each(function () {
        // if(($(this).hasClass('folder')) && $(this).hasClass('folder-icon')) {
        if ($(this).hasClass('folder')) {
          const idFolder = $(this).attr('data-folder-id');
          const folder = getGame().folders?.find((f: Folder) => f.id == idFolder);

          const data = <any>folder?.getFlag(FOLDER_THUMBNAIL_MODULE_NAME, 'folderIcon');
          if(data){
            const folderIcon = data.folderIcon;
            const folderIconOpen = data.folderIconOpen;
            const folderIconFontAwesome = data.folderIconFontAwesome;
            const folderIconFontAwesomeOpen = data.folderIconFontAwesomeOpen;
            const folderIconUseIconInsteadImage = data.folderIconUseIconInsteadImage;

            const targetIcon: JQuery<HTMLElement> = $(this).find('.folder-header h3 i') 
              || $(this).find('.folder-header h3 img');
            let thumbnail;
            //@ts-ignore
            if (!folder?.expanded && folderIcon && !folderIconUseIconInsteadImage) {
              thumbnail = `<img class="folder-icon" src="${folderIcon}" alt="Folder Icon Thumbnail">`;
            } else if (!folder?.expanded && folderIconFontAwesome && folderIconUseIconInsteadImage) {
              thumbnail = `<i class="fas ${folderIconFontAwesome} fa-fw"></i>`;
            } else if (folder?.expanded && folderIconOpen && !folderIconUseIconInsteadImage) {
              thumbnail = `<img class="folder-icon" src="${folderIconOpen}" alt="Folder Icon Thumbnail">`;
            } else if (folder?.expanded && folderIconFontAwesomeOpen && folderIconUseIconInsteadImage) {
              thumbnail = `<i class="fas ${folderIconFontAwesomeOpen} fa-fw"></i>`;
            } else if (!folder?.expanded) {
              thumbnail = `<i class="fas fa-folder-open fa-fw"></i>`;
            } else if (folder?.expanded) {
              thumbnail = `<i class="fas fa-folder fa-fw"></i>`;
            }
            targetIcon.replaceWith(thumbnail);

            $(this).click((ev) => {
              const li = ev.currentTarget;
              const folderId = li.dataset.folderId;
              const folder = getGame().folders?.find((f: Folder) => f.id == folderId);
              const data = <any>folder?.getFlag(FOLDER_THUMBNAIL_MODULE_NAME, 'folderIcon');

              if(data){

                const folderIcon = data.folderIcon;
                const folderIconOpen = data.folderIconOpen;
                const folderIconFontAwesome = data.folderIconFontAwesome;
                const folderIconFontAwesomeOpen = data.folderIconFontAwesomeOpen;
                const folderIconUseIconInsteadImage = data.folderIconUseIconInsteadImage;
                const targetIcon: JQuery<HTMLElement> = $(li).find('.folder-header h3 i') 
                  || $(li).find('.folder-header h3 img');
                let thumbnail;
                if (!folder?.expanded && folderIconOpen && !folderIconUseIconInsteadImage) {
                  thumbnail = `<img class="folder-icon" src="${folderIconOpen}" alt="Folder Icon Thumbnail">`;
                } else if (!folder?.expanded && folderIconFontAwesomeOpen && folderIconUseIconInsteadImage) {
                  thumbnail = `<i class="fas ${folderIconFontAwesomeOpen} fa-fw"></i>`;
                } else if (folder?.expanded && folderIcon && !folderIconUseIconInsteadImage) {
                  thumbnail = `<img class="folder-icon" src="${folderIcon}" alt="Folder Icon Thumbnail">`;
                } else if (folder?.expanded && folderIconFontAwesome && folderIconUseIconInsteadImage) {
                  thumbnail = `<i class="fas ${folderIconFontAwesome} fa-fw"></i>`;
                } else if (!folder?.expanded) {
                  thumbnail = `<i class="fas fa-folder-open fa-fw"></i>`;
                } else if (folder?.expanded) {
                  thumbnail = `<i class="fas fa-folder fa-fw"></i>`;
                }
                targetIcon.replaceWith(thumbnail);
              }
            });
          }
        }
      });
    }
    // });
  });

  Hooks.on('renderItemDirectory', async function (app, html) {
    //
  });

  Hooks.on('renderJournalDirectory', async function (app, html) {
    //
  });

  Hooks.on('renderPlaylistDirectory', async function (app, html) {
    //
  });

  Hooks.on('renderRollTableDirectory', async function (app, html) {
    //
  });

  Hooks.on('renderSceneDirectory', async function (app, html) {
    //
  });

  Hooks.on('renderMacroDirectory', async function (app, html) {
    //
  });
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
