import * as MonacoType from 'monaco-editor';

// ─── SA-MP / open.mp Native Function Signatures ──────────────────────────────
const nativeSignatures: Record<string, { signature: string; doc: string; params: string[] }> = {
    'SendClientMessage': {
        signature: 'SendClientMessage(playerid, color, const message[])',
        doc: 'Sends a message to a specific player in the chat. The whole line in the chatbox coloured.',
        params: ['playerid - The player to send the message to', 'color - The color of the message (RGBA)', 'message[] - The message text to send'],
    },
    'SendClientMessageToAll': {
        signature: 'SendClientMessageToAll(color, const message[])',
        doc: 'Broadcasts a message to all connected players.',
        params: ['color - The color of the message (RGBA)', 'message[] - The message text to broadcast'],
    },
    'SetPlayerPos': {
        signature: 'SetPlayerPos(playerid, Float:x, Float:y, Float:z)',
        doc: 'Sets the position of a player.',
        params: ['playerid - The player to set position for', 'x - The X coordinate', 'y - The Y coordinate', 'z - The Z coordinate'],
    },
    'GetPlayerPos': {
        signature: 'GetPlayerPos(playerid, &Float:x, &Float:y, &Float:z)',
        doc: 'Gets the position of a player, passed by reference.',
        params: ['playerid - The player to get position of', 'x - Float reference for X', 'y - Float reference for Y', 'z - Float reference for Z'],
    },
    'SetTimer': {
        signature: 'SetTimer(const funcname[], interval, repeating)',
        doc: 'Calls a public function at regular intervals.',
        params: ['funcname[] - Name of the public function to call', 'interval - Interval in milliseconds', 'repeating - Whether the timer repeats (1=yes, 0=no)'],
    },
    'SetTimerEx': {
        signature: 'SetTimerEx(const funcname[], interval, repeating, const format[], ...)',
        doc: 'Calls a public function at regular intervals, passing parameters.',
        params: ['funcname[] - Name of the function', 'interval - Interval in ms', 'repeating - 1=repeat, 0=once', 'format[] - Format specifiers (i, f, s, etc.)', '... - Variables matching format'],
    },
    'KillTimer': {
        signature: 'KillTimer(timerid)',
        doc: 'Stops a running timer.',
        params: ['timerid - The timer ID returned by SetTimer/SetTimerEx'],
    },
    'format': {
        signature: 'format(output[], size, const format[], ...)',
        doc: 'Formats a string similarly to printf but writes to a buffer.',
        params: ['output[] - Destination buffer', 'size - Size of the output buffer', 'format[] - Format string', '... - Variables to format'],
    },
    'printf': {
        signature: 'printf(const format[], ...)',
        doc: 'Prints a formatted string to the server log.',
        params: ['format[] - Format string with optional specifiers', '... - Variables'],
    },
    'print': {
        signature: 'print(const string[])',
        doc: 'Prints a plain string to the server log.',
        params: ['string[] - The text to print'],
    },
    'ShowPlayerDialog': {
        signature: 'ShowPlayerDialog(playerid, dialogid, style, const caption[], const info[], const button1[], const button2[])',
        doc: 'Shows a dialog box to a player.',
        params: ['playerid', 'dialogid - Dialog ID (0-32767)', 'style - DIALOG_STYLE_*', 'caption[] - Title', 'info[] - Content', 'button1[] - Primary button', 'button2[] - Secondary button (or empty)'],
    },
    'CreateVehicle': {
        signature: 'CreateVehicle(vehicletype, Float:x, Float:y, Float:z, Float:rotation, color1, color2, respawn_delay, addsiren=0)',
        doc: 'Creates a vehicle in the world.',
        params: ['vehicletype - Vehicle model ID', 'x, y, z - Spawn position', 'rotation - Z angle', 'color1, color2 - Paint colors (-1 = random)', 'respawn_delay - Seconds until empty vehicle respawns (-1 = never)', 'addsiren - 1 = add siren (default 0)'],
    },
    'GivePlayerWeapon': {
        signature: 'GivePlayerWeapon(playerid, weaponid, ammo)',
        doc: 'Gives a player a weapon with specified ammo.',
        params: ['playerid', 'weaponid - WEAPON_* constant or ID', 'ammo - Amount of ammo to give'],
    },
    'SetPlayerHealth': {
        signature: 'SetPlayerHealth(playerid, Float:health)',
        doc: "Sets a player's health.",
        params: ['playerid', 'health - Health value (0.0 - 100.0+)'],
    },
    'GetPlayerHealth': {
        signature: 'GetPlayerHealth(playerid, &Float:health)',
        doc: "Gets a player's health (passed by reference).",
        params: ['playerid', 'health - Float variable to store health'],
    },
    'SetPlayerArmour': {
        signature: 'SetPlayerArmour(playerid, Float:armour)',
        doc: "Sets a player's armour.",
        params: ['playerid', 'armour - Armour value (0.0 - 100.0)'],
    },
    'IsPlayerConnected': {
        signature: 'IsPlayerConnected(playerid)',
        doc: 'Checks if a player is connected.',
        params: ['playerid - Player to check'],
    },
    'GetPlayerName': {
        signature: 'GetPlayerName(playerid, const name[], len)',
        doc: "Gets the player's name.",
        params: ['playerid', 'name[] - String to store the name', 'len - Max length (MAX_PLAYER_NAME)'],
    },
    'SetPlayerName': {
        signature: 'SetPlayerName(playerid, const name[])',
        doc: "Sets the player's name. Returns 1 on success.",
        params: ['playerid', 'name[] - New name (max 24 chars)'],
    },
    'CallLocalFunction': {
        signature: 'CallLocalFunction(const function[], const format[], ...)',
        doc: 'Calls a public function in the same script.',
        params: ['function[] - Name of the public function', 'format[] - Parameter format (i, f, s)', '... - Arguments'],
    },
    'CallRemoteFunction': {
        signature: 'CallRemoteFunction(const function[], const format[], ...)',
        doc: 'Calls a public function in all loaded scripts.',
        params: ['function[] - Function name', 'format[] - Parameter format', '... - Arguments'],
    },
    'db_open': {
        signature: 'db_open(const name[])',
        doc: 'Opens an SQLite database (creates if not exists). Returns a DB handle.',
        params: ['name[] - Filename of the SQLite database'],
    },
    'db_query': {
        signature: 'db_query(DB:db, const query[])',
        doc: 'Executes an SQL query. Returns a DBResult handle.',
        params: ['db - DB handle from db_open', 'query[] - SQL query string'],
    },
    'TextDrawCreate': {
        signature: 'TextDrawCreate(Float:x, Float:y, const text[])',
        doc: 'Creates a global textdraw. Returns its Text handle.',
        params: ['x - X position (0-640)', 'y - Y position (0-480)', 'text[] - Text content'],
    },
    'Create3DTextLabel': {
        signature: 'Create3DTextLabel(const text[], color, Float:X, Float:Y, Float:Z, Float:DrawDistance, virtualworld, testLOS=0)',
        doc: 'Creates a 3D text label at a world position.',
        params: ['text[]', 'color - RGBA', 'X, Y, Z - World position', 'DrawDistance', 'virtualworld - Virtual world (-1 = all)', 'testLOS - Line of sight test'],
    },
};

const keywords = [
    'assert', 'break', 'case', 'continue', 'default', 'do', 'else', 'enum', 'exit',
    'for', 'forward', 'goto', 'if', 'native', 'new', 'operator', 'public', 'return',
    'static', 'stock', 'switch', 'tagof', 'while', 'const', 'char', 'bool', 'float',
    'sizeof', 'state', 'sleep', 'defined'
];

const typeKeywords = [
    'bool', 'Float', 'File', 'Text', 'PlayerText', 'Text3D', 'PlayerText3D',
    'Menu', 'Group', 'DB', 'DBResult'
];

const directives = [
    '#define', '#undef', '#if', '#else', '#elseif', '#endif', '#include',
    '#tryinclude', '#pragma', '#emit', '#assert', '#error', '#endinput', '#line'
];

const natives = [
    // Core
    'print', 'printf', 'format', 'SetTimer', 'SetTimerEx', 'KillTimer', 'GetTickCount',
    'GetMaxPlayers', 'VectorSize', 'asin', 'acos', 'atan', 'atan2', 'sqrt', 'pow', 'log',
    'sin', 'cos', 'tan', 'floatsqroot', 'floatpower', 'floatlog', 'floatsin', 'floatcos',
    'floattan', 'floatabs', 'floatround', 'floatstr', 'float', 'floatadd', 'floatsub',
    'floatmul', 'floatdiv', 'floatcmp', 'numargs', 'getarg', 'setarg',
    'strlen', 'strcat', 'strsub', 'strcmp', 'strfind', 'strtrim', 'strins', 'strdel',
    'strtolower', 'strtoupper', 'ispacked', 'valstr', 'uudecode', 'uuencode',
    'random', 'clamp', 'min', 'max',

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
    'GetPlayerCameraAspectRatio', 'GetPlayerCameraZoom',
    'AllowPlayerTeleport', 'SetPlayerName', 'GetPlayerName',
    'IsPlayerAdmin', 'SetPlayerScore', 'GetPlayerScore', 'GetPlayerPing', 'SetPlayerHealth',
    'GetPlayerHealth', 'SetPlayerArmour', 'GetPlayerArmour', 'SetPlayerTeam', 'GetPlayerTeam',
    'SetPlayerColor', 'GetPlayerColor', 'SetPlayerSkin', 'GetPlayerSkin', 'GivePlayerWeapon',
    'ResetPlayerWeapons', 'GetPlayerWeapon', 'GetPlayerAmmo', 'GetPlayerWeaponData',
    'GivePlayerMoney', 'ResetPlayerMoney', 'GetPlayerMoney', 'SetPlayerWantedLevel',
    'GetPlayerWantedLevel', 'SetPlayerFightingStyle', 'GetPlayerFightingStyle',
    'SetPlayerVelocity', 'GetPlayerVelocity', 'PlayCrimeReportForPlayer', 'PlayAudioStreamForPlayer',
    'StopAudioStreamForPlayer', 'SetPlayerShopName', 'SetPlayerSkillLevel',
    'GetPlayerSurfingVehicleID', 'GetPlayerSurfingObjectID', 'RemovePlayerFromVehicle',
    'TogglePlayerControllable', 'SetPlayerSpecialAction', 'GetPlayerSpecialAction',
    'SetPlayerInterior', 'GetPlayerInterior', 'SetPlayerVirtualWorld', 'GetPlayerVirtualWorld',
    'ShowPlayerDialog', 'GetPlayerDialogID', 'SetPlayerDrunkLevel', 'GetPlayerDrunkLevel',
    'SetPlayerTime', 'GetPlayerTime', 'ToggleClock', 'SetPlayerWeather', 'ForceClassSelection',
    'SetPlayerGravity', 'GetPlayerGravity', 'SetPlayerAdmin', 'Kick', 'Ban', 'BanEx',
    'IsPlayerNPC', 'GetPlayerIp', 'GetPlayerVersion', 'AllowAdminTeleport',
    'GetPlayerState', 'SpawnPlayer', 'SetSpawnInfo', 'ShowPlayerMarkers', 'ShowNameTags',
    'SetNameTagDrawDistance', 'SetDeathDropAmount', 'CreateExplosion', 'CreateExplosionForPlayer',
    'EnableVehicleFriendlyFire', 'SetWorldTime', 'SetWeather', 'SetGravity',
    'UsePlayerPedAnims', 'DisableInteriorEnterExits', 'SetPlayerChatBubble',
    'PutPlayerInVehicle', 'GetPlayerVehicleID', 'GetPlayerVehicleSeat',
    'ApplyAnimation', 'ClearAnimations', 'GetAnimationName',
    'GetPlayerAnimationIndex', 'SetPlayerAttachedObject', 'RemovePlayerAttachedObject',
    'IsPlayerAttachedObjectSlotUsed', 'EditAttachedObject', 'SelectTextDraw', 'CancelSelectTextDraw',
    'SetPlayerMapIcon', 'RemovePlayerMapIcon', 'NetworkStats', 'GetPlayerNetworkStats',
    'IsPlayerStreamedIn',

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
    'AddStaticVehicle', 'AddStaticVehicleEx', 'ManualVehicleEngineAndLights',
    'SetVehicleParamsForPlayer',

    // Object
    'CreateObject', 'AttachObjectToVehicle', 'AttachObjectToObject', 'AttachObjectToPlayer',
    'SetObjectPos', 'GetObjectPos', 'SetObjectRot', 'GetObjectRot', 'IsValidObject',
    'DestroyObject', 'MoveObject', 'StopObject', 'IsObjectMoving', 'EditObject',
    'EditPlayerObject', 'SelectObject', 'CancelEdit', 'CreatePlayerObject',
    'AttachPlayerObjectToVehicle', 'AttachPlayerObjectToPlayer', 'SetPlayerObjectPos',
    'GetPlayerObjectPos', 'SetPlayerObjectRot', 'GetPlayerObjectRot', 'IsValidPlayerObject',
    'DestroyPlayerObject', 'MovePlayerObject', 'StopPlayerObject', 'IsPlayerObjectMoving',
    'SetObjectMaterial', 'SetPlayerObjectMaterial', 'SetObjectMaterialText', 'SetPlayerObjectMaterialText',
    'SetObjectNoCameraCol', 'SetPlayerObjectNoCameraCol',

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

    // Pickups
    'CreatePickup', 'AddStaticPickup', 'DestroyPickup',

    // Actors
    'CreateActor', 'DestroyActor', 'IsActorStreamedIn', 'SetActorVirtualWorld', 'GetActorVirtualWorld',
    'ApplyActorAnimation', 'ClearActorAnimations', 'SetActorPos', 'GetActorPos',
    'SetActorFacingAngle', 'GetActorFacingAngle', 'SetActorHealth', 'GetActorHealth',
    'SetActorInvulnerable', 'IsActorInvulnerable', 'IsValidActor', 'GetActorPoolSize',

    // Database
    'db_open', 'db_close', 'db_query', 'db_free_result', 'db_num_rows', 'db_next_row',
    'db_num_fields', 'db_field_name', 'db_get_field', 'db_get_field_assoc',
    'db_get_field_int', 'db_get_field_assoc_int', 'db_get_field_float', 'db_get_field_assoc_float',

    // Files
    'fopen', 'fclose', 'fwrite', 'fread', 'fputchar', 'fgetchar', 'fblockwrite',
    'fblockread', 'fseek', 'flength', 'fexist', 'fremove', 'frename', 'fcopy',

    // Other
    'CallLocalFunction', 'CallRemoteFunction', 'GetWeaponName', 'GetConsoleVarAsString',
    'GetConsoleVarAsInt', 'GetConsoleVarAsBool', 'HTTP', 'SetGameModeText', 'SetTeamCount',
    'AddPlayerClass', 'AddPlayerClassEx', 'SetPlayerColor', 'GetPlayerColor',
    'EnableStuntBonusForAll', 'EnableStuntBonusForPlayer', 'TextDrawIsValid',
    'IsValidVehicle', 'GetVehiclePoolSize', 'GetPlayerPoolSize',
];

const constants = [
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
    'WEAPON_INFRARED', 'WEAPON_PARACHUTE', 'WEAPON_VEHICLE', 'WEAPON_DROWN', 'WEAPON_COLLISION',
    'DIALOG_STYLE_MSGBOX', 'DIALOG_STYLE_INPUT', 'DIALOG_STYLE_LIST',
    'DIALOG_STYLE_PASSWORD', 'DIALOG_STYLE_TABLIST', 'DIALOG_STYLE_TABLIST_HEADERS',
    'CLICK_SOURCE_SCOREBOARD', 'EDIT_RESPONSE_CANCEL', 'EDIT_RESPONSE_FINAL', 'EDIT_RESPONSE_UPDATE',
    'SELECT_OBJECT_GLOBAL_OBJECT', 'SELECT_OBJECT_PLAYER_OBJECT',
    'BULLET_HIT_TYPE_NONE', 'BULLET_HIT_TYPE_PLAYER', 'BULLET_HIT_TYPE_VEHICLE',
    'BULLET_HIT_TYPE_OBJECT', 'BULLET_HIT_TYPE_PLAYER_OBJECT',
    'MAPICON_LOCAL', 'MAPICON_GLOBAL', 'MAPICON_LOCAL_CHECKPOINT', 'MAPICON_GLOBAL_CHECKPOINT',
    'CAMERA_CUT', 'CAMERA_MOVE',
    'CAR_MODIFY_PANELSTATES', 'CAR_MODIFY_DOORSTATES', 'CAR_MODIFY_LIGHTS', 'CAR_MODIFY_TIRES',
    'KEY_ACTION', 'KEY_CROUCH', 'KEY_FIRE', 'KEY_SPRINT', 'KEY_SECONDARY_ATTACK',
    'KEY_JUMP', 'KEY_LOOK_RIGHT', 'KEY_HANDBRAKE', 'KEY_LOOK_LEFT', 'KEY_SUBMISSION',
    'KEY_LOOK_BEHIND', 'KEY_WALK', 'KEY_ANALOG_UP', 'KEY_ANALOG_DOWN', 'KEY_ANALOG_RIGHT',
    'KEY_ANALOG_LEFT', 'KEY_YES', 'KEY_NO', 'KEY_CTRL_BACK', 'KEY_UP', 'KEY_DOWN',
    'GAME_STATE_CONNECTED', 'GAME_STATE_DISCONNECTED',
    'true', 'false', 'null',
];

const callbacks = [
    'OnGameModeInit', 'OnGameModeExit', 'OnFilterScriptInit', 'OnFilterScriptExit',
    'OnPlayerConnect', 'OnPlayerDisconnect', 'OnPlayerSpawn', 'OnPlayerDeath',
    'OnVehicleSpawn', 'OnVehicleDeath', 'OnPlayerText', 'OnPlayerCommandText',
    'OnPlayerRequestClass', 'OnPlayerEnterVehicle', 'OnPlayerExitVehicle',
    'OnPlayerStateChange', 'OnPlayerEnterCheckpoint', 'OnPlayerLeaveCheckpoint',
    'OnPlayerEnterRaceCheckpoint', 'OnPlayerLeaveRaceCheckpoint',
    'OnRconCommand', 'OnPlayerRequestSpawn', 'OnObjectMoved', 'OnPlayerObjectMoved',
    'OnPlayerPickUpPickup', 'OnVehicleMod', 'OnEnterExitModShop',
    'OnVehiclePaintjob', 'OnVehicleRespray', 'OnVehicleDamageStatusUpdate',
    'OnUnoccupiedVehicleUpdate', 'OnPlayerSelectedMenuRow', 'OnPlayerExitedMenu',
    'OnPlayerInteriorChange', 'OnPlayerKeyStateChange', 'OnRconLoginAttempt',
    'OnPlayerUpdate', 'OnPlayerStreamIn', 'OnPlayerStreamOut',
    'OnVehicleStreamIn', 'OnVehicleStreamOut', 'OnDialogResponse',
    'OnPlayerTakeDamage', 'OnPlayerGiveDamage', 'OnPlayerClickMap',
    'OnPlayerClickTextDraw', 'OnPlayerClickPlayerTextDraw', 'OnIncomingConnection',
    'OnTrailerUpdate', 'OnVehicleSirenStateChange', 'OnActorStreamIn', 'OnActorStreamOut',
    'OnPlayerGiveDamageActor', 'OnPlayerClickPlayer', 'OnPlayerEditObject',
    'OnPlayerEditAttachedObject', 'OnPlayerSelectObject', 'OnPlayerWeaponShot',
];

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

    // ─── Token Provider ──────────────────────────────────────────────────────
    monaco.languages.setMonarchTokensProvider(langId, {
        defaultToken: '',
        tokenPostfix: '.pawn',

        keywords,
        typeKeywords,
        directives,
        natives,
        constants,
        callbacks,

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
                        '@callbacks': 'entity.name.function.callback',
                        '@keywords': 'keyword',
                        '@natives': 'entity.name.function',
                        '@constants': 'variable.predefined',
                        '@default': 'identifier'
                    }
                }],

                [/[A-Z][A-Z0-9_$]+/, 'variable.predefined'],

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

    // ─── Language Configuration ─────────────────────────────────────────────
    monaco.languages.setLanguageConfiguration(langId, {
        comments: {
            lineComment: '//',
            blockComment: ['/*', '*/'],
        },
        brackets: [
            ['{', '}'],
            ['[', ']'],
            ['(', ')'],
        ],
        autoClosingPairs: [
            { open: '{', close: '}' },
            { open: '[', close: ']' },
            { open: '(', close: ')' },
            { open: '"', close: '"', notIn: ['string'] },
            { open: "'", close: "'", notIn: ['string'] },
        ],
        surroundingPairs: [
            { open: '{', close: '}' },
            { open: '[', close: ']' },
            { open: '(', close: ')' },
            { open: '"', close: '"' },
            { open: "'", close: "'" },
        ],
        indentationRules: {
            increaseIndentPattern: /^.*\{[^}"']*$/,
            decreaseIndentPattern: /^(.*\*\/)?\s*\}[;\s]*$/,
        },
        onEnterRules: [
            {
                // Auto-insert * on new line in block comment
                beforeText: /^\s*\/\*\*?[^\/]*$/,
                afterText: /^(?!\s*\*\/).*$/,
                action: { indentAction: monaco.languages.IndentAction.None, appendText: ' * ' },
            },
        ],
        folding: {
            markers: {
                start: /^\s*\/\/#region\b|^\s*\{/,
                end: /^\s*\/\/#endregion\b|^\s*\}/,
            },
        },
        wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
    });

    // ─── Autocomplete Provider ────────────────────────────────────────────────
    monaco.languages.registerCompletionItemProvider(langId, {
        triggerCharacters: ['(', '#', '<', '"'],
        provideCompletionItems(model, position) {
            const word = model.getWordUntilPosition(position);
            const range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: word.startColumn,
                endColumn: word.endColumn,
            };

            const suggestions: MonacoType.languages.CompletionItem[] = [];

            // Keywords
            keywords.forEach(kw => suggestions.push({
                label: kw,
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: kw,
                range,
            }));

            // Types
            typeKeywords.forEach(t => suggestions.push({
                label: t,
                kind: monaco.languages.CompletionItemKind.TypeParameter,
                insertText: t,
                range,
            }));

            // Natives with snippets for known ones
            natives.forEach(fn => {
                const sig = nativeSignatures[fn];
                suggestions.push({
                    label: fn,
                    kind: monaco.languages.CompletionItemKind.Function,
                    insertText: fn,
                    detail: sig ? sig.signature : fn,
                    documentation: sig ? { value: `**${fn}**\n\n${sig.doc}` } : undefined,
                    range,
                });
            });

            // Callbacks
            callbacks.forEach(cb => suggestions.push({
                label: cb,
                kind: monaco.languages.CompletionItemKind.Event,
                insertText: cb,
                detail: `Callback: ${cb}`,
                range,
            }));

            // Constants
            constants.forEach(c => suggestions.push({
                label: c,
                kind: monaco.languages.CompletionItemKind.Constant,
                insertText: c,
                range,
            }));

            // Snippets
            const snippets: MonacoType.languages.CompletionItem[] = [
                {
                    label: 'public OnPlayerConnect',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'public OnPlayerConnect(playerid)\n{\n\t$0\n\treturn 1;\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    detail: 'Snippet: OnPlayerConnect callback',
                    range,
                },
                {
                    label: 'public OnPlayerCommandText',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'public OnPlayerCommandText(playerid, cmdtext[])\n{\n\tif(!strcmp(cmdtext, "/${1:command}", true))\n\t{\n\t\t$0\n\t\treturn 1;\n\t}\n\treturn 0;\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    detail: 'Snippet: OnPlayerCommandText with command check',
                    range,
                },
                {
                    label: 'SetTimer snippet',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'SetTimer("${1:FunctionName}", ${2:1000}, ${3:false});',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    detail: 'Snippet: SetTimer',
                    range,
                },
                {
                    label: 'new Float',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'new Float:${1:variable} = ${2:0.0};',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    detail: 'Snippet: Float variable',
                    range,
                },
                {
                    label: 'for loop',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'for(new ${1:i} = 0; ${1:i} < ${2:MAX_PLAYERS}; ${1:i}++)\n{\n\t$0\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    detail: 'Snippet: for loop',
                    range,
                },
                {
                    label: '#include',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: '#include <${1:a_samp}>',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    detail: 'Snippet: #include directive',
                    range,
                },
                {
                    label: '#define',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: '#define ${1:NAME} ${2:value}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    detail: 'Snippet: #define directive',
                    range,
                },
                {
                    label: 'CMD:',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'CMD:${1:command}(playerid, params[])\n{\n\t$0\n\treturn 1;\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    detail: 'Snippet: zcmd/sscanf command',
                    range,
                },
                {
                    label: 'SendClientMessage snippet',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'SendClientMessage(${1:playerid}, ${2:0xFF0000FF}, "${3:Message}");',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    detail: 'Snippet: SendClientMessage',
                    range,
                },
            ];

            return { suggestions: [...suggestions, ...snippets] };
        },
    });

    // ─── Hover Provider ──────────────────────────────────────────────────────
    monaco.languages.registerHoverProvider(langId, {
        provideHover(model, position) {
            const word = model.getWordAtPosition(position);
            if (!word) return null;

            const fn = word.word;
            const sig = nativeSignatures[fn];
            if (!sig) return null;

            const contents: MonacoType.IMarkdownString[] = [
                { value: `\`\`\`pawn\n${sig.signature}\n\`\`\`` },
                { value: sig.doc },
            ];

            if (sig.params.length > 0) {
                contents.push({
                    value: '**Parameters:**\n' + sig.params.map(p => `- \`${p}\``).join('\n'),
                });
            }

            return {
                range: new monaco.Range(
                    position.lineNumber, word.startColumn,
                    position.lineNumber, word.endColumn
                ),
                contents,
            };
        },
    });

    // ─── Signature Help Provider ─────────────────────────────────────────────
    monaco.languages.registerSignatureHelpProvider(langId, {
        signatureHelpTriggerCharacters: ['(', ','],
        signatureHelpRetriggerCharacters: [','],
        provideSignatureHelp(model, position) {
            const lineContent = model.getLineContent(position.lineNumber);
            const textUntilCursor = lineContent.substring(0, position.column - 1);

            // Find the function call by scanning backwards for open paren
            let depth = 0;
            let fnEnd = -1;
            let activeParam = 0;
            for (let i = textUntilCursor.length - 1; i >= 0; i--) {
                const ch = textUntilCursor[i];
                if (ch === ')') depth++;
                else if (ch === '(') {
                    if (depth === 0) { fnEnd = i; break; }
                    depth--;
                } else if (ch === ',' && depth === 0) {
                    activeParam++;
                }
            }

            if (fnEnd === -1) return null;

            const fnNameMatch = textUntilCursor.substring(0, fnEnd).match(/[a-zA-Z_]\w*$/);
            if (!fnNameMatch) return null;

            const fnName = fnNameMatch[0];
            const sig = nativeSignatures[fnName];
            if (!sig) return null;

            return {
                value: {
                    signatures: [{
                        label: sig.signature,
                        documentation: { value: sig.doc },
                        parameters: sig.params.map(p => ({
                            label: p.split(' - ')[0],
                            documentation: { value: p },
                        })),
                    }],
                    activeSignature: 0,
                    activeParameter: Math.min(activeParam, sig.params.length - 1),
                },
                dispose() { },
            };
        },
    });
}
