import * as MonacoType from 'monaco-editor';

export function registerPawnLanguage(monaco: typeof MonacoType) {
    const langId = 'pawn';


    const languages = monaco.languages.getLanguages();
    if (languages.find(l => l.id === langId)) return;

    monaco.languages.register({
        id: langId,
        extensions: ['.pwn', '.inc', '.p'],
        aliases: ['Pawn', 'pawn'],
        mimetypes: ['text/x-pawn']
    });

    monaco.languages.setMonarchTokensProvider(langId, {
        defaultToken: '',
        tokenPostfix: '.pawn',

        keywords: [
            'assert', 'break', 'case', 'continue', 'default', 'do', 'else', 'enum', 'exit',
            'for', 'forward', 'goto', 'if', 'native', 'new', 'operator', 'public', 'return',
            'static', 'stock', 'switch', 'tagof', 'while', 'const', 'char', 'bool', 'float',
            'sizeof', 'state', 'sleep', 'defined'
        ],

        typeKeywords: [
            'bool', 'Float', 'File', 'Text', 'PlayerText', 'Text3D', 'PlayerText3D',
            'Menu', 'Group', 'DB', 'DBResult'
        ],

        directives: [
            '#define', '#undef', '#if', '#else', '#elseif', '#endif', '#include',
            '#tryinclude', '#pragma', '#emit', '#assert', '#error', '#endinput', '#line'
        ],

        natives: [
            // Core
            'print', 'printf', 'format', 'SetTimer', 'SetTimerEx', 'KillTimer', 'GetTickCount',
            'GetMaxPlayers', 'VectorSize', 'asin', 'acos', 'atan', 'atan2', 'sqrt', 'pow', 'log',
            'sin', 'cos', 'tan', 'floatsqroot', 'floatpower', 'floatlog', 'floatsin', 'floatcos',
            'floattan', 'floatabs', 'floatround', 'floatstr', 'float', 'floatadd', 'floatsub',
            'floatmul', 'floatdiv', 'floatcmp',

            // Player
            'SendClientMessage', 'SendClientMessageToAll', 'SendPlayerMessageToPlayer',
            'SendPlayerMessageToAll', 'SetPlayerPos', 'SetPlayerPosFindZ', 'GetPlayerPos',
            'SetPlayerFacingAngle', 'GetPlayerFacingAngle', 'IsPlayerInRangeOfPoint',
            'GetPlayerDistanceFromServerCenter', 'IsPlayerConnected', 'IsPlayerInVehicle',
            'IsPlayerInAnyVehicle', 'IsPlayerInCheckpoint', 'IsPlayerInRaceCheckpoint',
            'SetPlayerCheckpoint', 'DisablePlayerCheckpoint', 'SetPlayerRaceCheckpoint',
            'DisablePlayerRaceCheckpoint', 'SetPlayerWorldBounds', 'SetPlayerMarkerForPlayer',
            'ShowPlayerNameTagForPlayer', 'SetPlayerMapIcon', 'RemovePlayerMapIcon',
            'SetPlayerCameraPos', 'SetPlayerCameraLookAt', 'SetCameraBehindPlayer',
            'GetPlayerCameraPos', 'GetPlayerCameraFrontVector', 'GetPlayerCameraMode',
            'GetPlayerCameraAspectRatio', 'GetPlayerCameraZoom', 'IsPlayerCameraTargetFree',
            'GetPlayerCameraTargetObject', 'GetPlayerCameraTargetVehicle', 'GetPlayerCameraTargetPlayer',
            'GetPlayerCameraTargetActor', 'AllowPlayerTeleport', 'SetPlayerName', 'GetPlayerName',
            'IsPlayerAdmin', 'SetPlayerScore', 'GetPlayerScore', 'GetPlayerPing', 'SetPlayerHealth',
            'GetPlayerHealth', 'SetPlayerArmour', 'GetPlayerArmour', 'SetPlayerTeam', 'GetPlayerTeam',
            'SetPlayerColor', 'GetPlayerColor', 'SetPlayerSkin', 'GetPlayerSkin', 'GivePlayerWeapon',
            'ResetPlayerWeapons', 'GetPlayerWeapon', 'GetPlayerAmmo', 'GetPlayerWeaponData',
            'GivePlayerMoney', 'ResetPlayerMoney', 'GetPlayerMoney', 'SetPlayerWantedLevel',
            'GetPlayerWantedLevel', 'SetPlayerFightingStyle', 'GetPlayerFightingStyle',
            'SetPlayerVelocity', 'GetPlayerVelocity', 'PlayCrimeReportForPlayer', 'PlayAudioStreamForPlayer',
            'StopAudioStreamForPlayer', 'SetPlayerShopName', 'SetPlayerSkillLevel', 'GetPlayerSurfingVehicleID',
            'GetPlayerSurfingObjectID', 'RemovePlayerFromVehicle', 'TogglePlayerControllable',
            'SetPlayerSpecialAction', 'GetPlayerSpecialAction', 'SetPlayerInterior', 'GetPlayerInterior',
            'SetPlayerVirtualWorld', 'GetPlayerVirtualWorld', 'ShowPlayerDialog', 'GetPlayerDialogID',

            // Vehicle
            'CreateVehicle', 'DestroyVehicle', 'IsVehicleStreamedIn', 'GetVehiclePos', 'SetVehiclePos',
            'GetVehicleZAngle', 'GetVehicleRotationQuat', 'SetVehicleZAngle', 'SetVehicleParamsEx',
            'GetVehicleParamsEx', 'GetVehicleParamsSirenState', 'SetVehicleParamsCarDoors',
            'GetVehicleParamsCarDoors', 'SetVehicleParamsCarWindows', 'GetVehicleParamsCarWindows',
            'SetVehicleToRespawn', 'LinkVehicleToInterior', 'AddVehicleComponent', 'RemoveVehicleComponent',
            'ChangeVehicleColor', 'ChangeVehiclePaintjob', 'SetVehicleHealth', 'GetVehicleHealth',
            'AttachTrailerToVehicle', 'DetachTrailerFromVehicle', 'IsTrailerAttachedToVehicle',
            'GetVehicleTrailer', 'SetVehicleNumberPlate', 'GetVehicleModel', 'GetVehicleComponentInSlot',
            'GetVehicleComponentType', 'RepairVehicle', 'GetVehicleVelocity', 'SetVehicleVelocity',
            'SetVehicleAngularVelocity', 'GetVehicleAngularVelocity', 'GetVehicleDamageStatus',
            'UpdateVehicleDamageStatus', 'GetVehicleModelInfo', 'SetVehicleVirtualWorld', 'GetVehicleVirtualWorld',

            // Object
            'CreateObject', 'AttachObjectToVehicle', 'AttachObjectToObject', 'AttachObjectToPlayer',
            'SetObjectPos', 'GetObjectPos', 'SetObjectRot', 'GetObjectRot', 'IsValidObject',
            'DestroyObject', 'MoveObject', 'StopObject', 'IsObjectMoving', 'EditObject',
            'EditPlayerObject', 'SelectObject', 'CancelEdit', 'CreatePlayerObject',
            'AttachPlayerObjectToVehicle', 'AttachPlayerObjectToPlayer', 'SetPlayerObjectPos',
            'GetPlayerObjectPos', 'SetPlayerObjectRot', 'GetPlayerObjectRot', 'IsValidPlayerObject',
            'DestroyPlayerObject', 'MovePlayerObject', 'StopPlayerObject', 'IsPlayerObjectMoving',
            'SetObjectMaterial', 'SetPlayerObjectMaterial', 'SetObjectMaterialText', 'SetPlayerObjectMaterialText',

            // TextDraw
            'TextDrawCreate', 'TextDrawDestroy', 'TextDrawLetterSize', 'TextDrawTextSize',
            'TextDrawAlignment', 'TextDrawColor', 'TextDrawUseBox', 'TextDrawBoxColor',
            'TextDrawSetShadow', 'TextDrawSetOutline', 'TextDrawBackgroundColor', 'TextDrawFont',
            'TextDrawSetProportional', 'TextDrawSetSelectable', 'TextDrawShowForPlayer',
            'TextDrawHideForPlayer', 'TextDrawShowForAll', 'TextDrawHideForAll', 'TextDrawSetString',
            'TextDrawSetPreviewModel', 'TextDrawSetPreviewRot', 'TextDrawSetPreviewVehCol',
            'PlayerTextDrawCreate', 'PlayerTextDrawDestroy', 'PlayerTextDrawLetterSize',
            'PlayerTextDrawTextSize', 'PlayerTextDrawAlignment', 'PlayerTextDrawColor',
            'PlayerTextDrawUseBox', 'PlayerTextDrawBoxColor', 'PlayerTextDrawSetShadow',
            'PlayerTextDrawSetOutline', 'PlayerTextDrawBackgroundColor', 'PlayerTextDrawFont',
            'PlayerTextDrawSetProportional', 'PlayerTextDrawSetSelectable', 'PlayerTextDrawShow',
            'PlayerTextDrawHide', 'PlayerTextDrawSetString', 'PlayerTextDrawSetPreviewModel',
            'PlayerTextDrawSetPreviewRot', 'PlayerTextDrawSetPreviewVehCol',

            // GangZones
            'GangZoneCreate', 'GangZoneDestroy', 'GangZoneShowForPlayer', 'GangZoneShowForAll',
            'GangZoneHideForPlayer', 'GangZoneHideForAll', 'GangZoneFlashForPlayer',
            'GangZoneFlashForAll', 'GangZoneStopFlashForPlayer', 'GangZoneStopFlashForAll',

            // 3D Text
            'Create3DTextLabel', 'Delete3DTextLabel', 'Attach3DTextLabelToPlayer',
            'Attach3DTextLabelToVehicle', 'Update3DTextLabelText', 'CreatePlayer3DTextLabel',
            'DeletePlayer3DTextLabel', 'UpdatePlayer3DTextLabelText',

            // Menus
            'CreateMenu', 'DestroyMenu', 'AddMenuItem', 'SetMenuColumnHeader', 'ShowMenuForPlayer',
            'HideMenuForPlayer', 'IsValidMenu', 'DisableMenu', 'DisableMenuItem', 'GetPlayerMenu',

            // Database
            'db_open', 'db_close', 'db_query', 'db_free_result', 'db_num_rows', 'db_next_row',
            'db_num_fields', 'db_field_name', 'db_get_field', 'db_get_field_assoc',
            'db_get_field_int', 'db_get_field_assoc_int', 'db_get_field_float', 'db_get_field_assoc_float',

            // Files
            'fopen', 'fclose', 'fwrite', 'fread', 'fputchar', 'fgetchar', 'fblockwrite',
            'fblockread', 'fseek', 'flength', 'fexist', 'fremove', 'frename', 'fcopy',

            // Other
            'CallLocalFunction', 'CallRemoteFunction', 'GetWeaponName', 'GetConsoleVarAsString',
            'GetConsoleVarAsInt', 'GetConsoleVarAsBool', 'HTTP', 'SetGameModeText', 'SetTeamCount'
        ],

        constants: [
            'MAX_PLAYERS', 'MAX_VEHICLES', 'MAX_OBJECTS', 'MAX_GANG_ZONES', 'MAX_TEXT_DRAWS',
            'MAX_PLAYER_TEXT_DRAWS', 'MAX_MENUS', 'MAX_3DTEXT_GLOBAL', 'MAX_3DTEXT_PLAYER',
            'MAX_PICKUPS', 'INVALID_PLAYER_ID', 'INVALID_VEHICLE_ID', 'INVALID_OBJECT_ID',
            'INVALID_MENU', 'INVALID_TEXT_DRAW', 'INVALID_GANG_ZONE', 'INVALID_3DTEXT_ID',
            'NO_TEAM', 'MAX_PLAYER_NAME', 'MAX_CLIENT_MESSAGES', 'MAX_ACTORS', 'INVALID_ACTOR_ID',
            'SPECIAL_ACTION_NONE', 'SPECIAL_ACTION_DUCK', 'SPECIAL_ACTION_JETPACK',
            'SPECIAL_ACTION_ENTER_VEHICLE', 'SPECIAL_ACTION_EXIT_VEHICLE',
            'PLAYER_STATE_NONE', 'PLAYER_STATE_ONFOOT', 'PLAYER_STATE_DRIVER',
            'PLAYER_STATE_PASSENGER', 'PLAYER_STATE_EXIT_VEHICLE', 'PLAYER_STATE_ENTER_VEHICLE',
            'PLAYER_STATE_WASTED', 'PLAYER_STATE_SPAWNED', 'PLAYER_STATE_SPECTATING',
            'WEAPON_FIST', 'WEAPON_BRASSKNUCKLE', 'WEAPON_GOLFCLUB', 'WEAPON_NITESTICK',
            'WEAPON_KNIFE', 'WEAPON_BAT', 'WEAPON_SHOVEL', 'WEAPON_POOLCUE', 'WEAPON_KATANA',
            'WEAPON_CHAINSAW', 'WEAPON_DILDO', 'WEAPON_DILDO2', 'WEAPON_VIBRATOR',
            'WEAPON_VIBRATOR2', 'WEAPON_FLOWER', 'WEAPON_CANE', 'WEAPON_GRENADE',
            'WEAPON_TEARGAS', 'WEAPON_MOLOTOV', 'WEAPON_COLT45', 'WEAPON_SILENCED',
            'WEAPON_DEAGLE', 'WEAPON_SHOTGUN', 'WEAPON_SAWEDOFF', 'WEAPON_SHOTGSPA',
            'WEAPON_UZI', 'WEAPON_MP5', 'WEAPON_AK47', 'WEAPON_M4', 'WEAPON_TEC9',
            'WEAPON_RIFLE', 'WEAPON_SNIPER', 'WEAPON_ROCKETLAUNCHER', 'WEAPON_HEATSEEKER',
            'WEAPON_FLAMETHROWER', 'WEAPON_MINIGUN', 'WEAPON_SATCHEL', 'WEAPON_BOMB',
            'WEAPON_SPRAYCAN', 'WEAPON_FIREEXTINGUISHER', 'WEAPON_CAMERA', 'WEAPON_NIGHTVISION',
            'WEAPON_INFRARED', 'WEAPON_PARACHUTE', 'WEAPON_VEHICLE', 'WEAPON_DROWN',
            'WEAPON_COLLISION', 'GAME_STATE_CONNECTED', 'GAME_STATE_DISCONNECTED'
        ],

        operators: [
            '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
            '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
            '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
            '%=', '<<=', '>>=', '>>>='
        ],

        symbols: /[=><!~?:&|+\-*\/\^%]+/,

        escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

        tokenizer: {
            root: [
                [/#(include|tryinclude)/, { token: 'keyword.directive', next: 'includePath' }],

                [/#\w+/, {
                    cases: {
                        '@directives': 'keyword.directive',
                        '@default': 'keyword.directive'
                    }
                }],

                [/[a-zA-Z_$][\w$]*/, {
                    cases: {
                        '@typeKeywords': 'type.identifier',
                        '@keywords': 'keyword',
                        '@natives': 'entity.name.function',
                        '@constants': 'variable.predefined',
                        '@default': 'identifier'
                    }
                }],

                [/[A-Z][A-Z0-9_$]*/, 'variable.predefined'], // Potential constants

                { include: '@whitespace' },

                [/[{}()\[\]]/, '@brackets'],
                [/[<>](?!@symbols)/, '@brackets'],
                [/@symbols/, {
                    cases: {
                        '@operators': 'operator',
                        '@default': ''
                    }
                }],

                [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
                [/0[xX][0-9a-fA-F]+/, 'number.hex'],
                [/\d+/, 'number'],

                [/[;,.]/, 'delimiter'],

                [/"([^"\\]|\\.)*$/, 'string.invalid'],
                [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],

                [/'[^\\']'/, 'string'],
                [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
                [/'/, 'string.invalid']
            ],

            includePath: [
                [/[ \t]+/, 'white'],
                [/<[^>]+>/, 'string.include', '@pop'],
                [/"[^"]+"/, 'string.include', '@pop'],
                [/$/, '', '@pop'],
            ],

            whitespace: [
                [/[ \t\r\n]+/, 'white'],
                [/\/\*/, 'comment', '@comment'],
                [/\/\/.*$/, 'comment'],
            ],

            comment: [
                [/[^\/*]+/, 'comment'],
                [/\/\*/, 'comment', '@push'],
                ["\\*/", 'comment', '@pop'],
                [/[\/*]/, 'comment']
            ],

            string: [
                [/[^\\"]+/, 'string'],
                [/@escapes/, 'string.escape'],
                [/\\./, 'string.escape.invalid'],
                [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
            ],
        },
        brackets: [
            { open: '{', close: '}', token: 'delimiter.curly' },
            { open: '[', close: ']', token: 'delimiter.square' },
            { open: '(', close: ')', token: 'delimiter.parenthesis' },
        ],
        autoClosingPairs: [
            { open: '{', close: '}' },
            { open: '[', close: ']' },
            { open: '(', close: ')' },
            { open: '"', close: '"' },
            { open: "'", close: "'" },
        ],
        surroundingPairs: [
            { open: '{', close: '}' },
            { open: '[', close: ']' },
            { open: '(', close: ')' },
            { open: '"', close: '"' },
            { open: "'", close: "'" },
        ],
    });
}
