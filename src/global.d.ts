declare global {
  const __SH_VERSION__: string;
  interface Window {
    SkyzHypno?: import("./api").SkyzHypnoPublicApi;
    SH?: import("./api").SkyzHypnoPublicApi;
    LSCG_Loaded?: boolean;
    Liko?: { HSC?: unknown };
    WCE?: unknown;
    bcx?: { getModApi(name: string): { on?(event: string, listener: (event: any) => void): void } };
  }

  interface Character {
    ID?: number;
    Name?: string;
    Nickname?: string;
    MemberNumber?: number;
    LabelColor?: string;
    ActivePose?: string[];
    Appearance?: any[];
    ArousalSettings?: { Progress?: number; OrgasmTimer?: number };
    GraphicsSettings?: { AllowBlur?: boolean };
    ImmersionSettings?: { AllowTints?: boolean };
    GameplaySettings?: Record<string, unknown>;
    OnlineSharedSettings?: Record<string, unknown>;
    ExtensionSettings?: Record<string, unknown>;
    OnlineSettings?: Record<string, unknown>;
    FriendList?: number[];
    GhostList?: number[];
    FocusGroup?: any;
    IsPlayer?(): boolean;
    IsOwnedByPlayer?(): boolean;
    IsOwnedByMemberNumber?(memberNumber: number): boolean;
    IsLoverOfMemberNumber?(memberNumber: number): boolean;
    CanWalk?(): boolean;
    CanTalk?(): boolean;
    CanChangeOwnClothes?(): boolean;
    IsGagged?(): boolean;
    GetPronouns?(): string;
  }


  interface PreferenceExtensionSettingRegistration {
    Identifier: string;
    ButtonText: string;
    Image?: string;
    click: () => void;
    run: () => void;
    exit: () => void;
    load: () => void;
  }

  interface ServerChatRoomMessage {
    Type: string;
    Content: string;
    Sender?: number;
    Target?: number;
    Dictionary?: any[];
  }

  const Player: Character;
  const ChatRoomCharacter: Character[];
  const ChatRoomData: { Admin?: number[] } | null;
  const CurrentScreen: string;
  const CurrentModule: string;
  const CurrentTime: number;
  const CommonTime: () => number;
  const TimerRunInterval: number;
  let ChatRoomTargetMemberNumber: number | null;
  let ChatRoomHideIconState: number;
  let ChatRoomCharacterViewCharacterCount: number;
  let MiniGameVictory: boolean;
  let MiniGameEnded: boolean;
  let MiniGameTimer: number;
  const MainCanvas: CanvasRenderingContext2D;

  function ServerSend(type: string, data: unknown): unknown;
  function ServerPlayerExtensionSettingsSync(key: string): void;
  const ServerPlayerOnlineSync: undefined | (() => void);
  function CharacterNickname(character: Character): string;
  function CharacterRefresh(character: Character, push: boolean): void;
  function CharacterLoadCanvas(character: Character): void;
  function ChatRoomCharacterUpdate(character: Character): void;
  function ChatRoomAppendChat(element: HTMLElement): void;
  function ChatRoomLeave(): void;
  function CommonSetScreen(module: string, screen: string): void;
  function ServerChatRoomGetAllowItem(source: Character, target: Character): boolean;
  function ActivityAllowed(): boolean;
  function AudioShouldSilenceSound(ignorePlayerSetting?: boolean): boolean;
  function AudioPlaySoundEffect(name: string, volume?: number): void;
  function DrawFlashScreen(color: string, duration: number, fade: number): void;
  function DrawText(text: string, x: number, y: number, color: string, outline?: string): void;
  function DrawTextFit(text: string, x: number, y: number, width: number, color: string, outline?: string): void;
  function DrawRect(x: number, y: number, width: number, height: number, color: string): void;
  function DrawEmptyRect(x: number, y: number, width: number, height: number, color: string, thickness?: number): void;
  function DrawButton(x: number, y: number, width: number, height: number, label: string, color: string, image?: string, tooltip?: string, disabled?: boolean): void;
  function DrawProgressBar(x: number, y: number, width: number, height: number, progress: number): void;
  function DrawCharacter(character: Character, x: number, y: number, zoom: number): void;
  function MouseIn(x: number, y: number, width: number, height: number): boolean;
  function CharacterSetFacialExpression(character: Character, group: string, expression: string | null, timer?: number, color?: string): void;
  function WardrobeGetExpression(character: Character): Record<string, string>;
  function PoseSetActive(character: Character, pose: any): void;
  function InventoryRemove(character: Character, group: string, refresh?: boolean): void;
  function MiniGameStart(name: string, difficulty: number, returnFunction: string): void;
  function MiniGameEnd(): void;
  function CommandParse(message: string): unknown;
  const PreferenceRegisterExtensionSetting: undefined | ((setting: PreferenceExtensionSettingRegistration) => void);
  const PreferenceSubscreenExtensionsClear: undefined | (() => void);
}

export {};
