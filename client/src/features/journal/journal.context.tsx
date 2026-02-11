import React, { createContext, useContext, useReducer, ReactNode } from "react";
import type {
  JournalBlock,
  TextBlock,
  ImageBlock,
} from "../../../types/journal";

// Type guards for discriminated union
export function isTextBlock(block: JournalBlock): block is TextBlock {
  return block.type === "text";
}

export function isImageBlock(block: JournalBlock): block is ImageBlock {
  return block.type === "image";
}

// Context State Interface
export interface JournalState {
  blocks: JournalBlock[];
  selectedBlockId: string | null;
  addMenuVisible: boolean;
  contextMenu: {
    visible: boolean;
    blockId: string | null;
    x: number;
    y: number;
  };
  copiedBlock: JournalBlock | null;
  chapterSliderVisible: boolean;
}

// Action Types
export type JournalAction =
  // Block CRUD
  | { type: "ADD_BLOCK"; payload: JournalBlock }
  | {
      type: "UPDATE_BLOCK";
      payload: { id: string; updates: Partial<JournalBlock> };
    }
  | { type: "DELETE_BLOCK"; payload: string }
  | { type: "SET_BLOCKS"; payload: JournalBlock[] }

  // Block manipulation
  | { type: "MOVE_BLOCK"; payload: { id: string; x: number; y: number } }
  | {
      type: "RESIZE_BLOCK";
      payload: {
        id: string;
        width: number;
        height: number;
        x: number;
        y: number;
      };
    }
  | { type: "ROTATE_BLOCK"; payload: { id: string; rotation: number } }
  | { type: "SELECT_BLOCK"; payload: string }
  | { type: "DESELECT_BLOCK" }

  // Text block specific
  | { type: "CHANGE_TEXT"; payload: { id: string; text: string } }
  | { type: "TOGGLE_BOLD"; payload: string }
  | { type: "TOGGLE_ITALIC"; payload: string }
  | { type: "TOGGLE_UNDERLINE"; payload: string }
  | { type: "CHANGE_COLOR"; payload: { id: string; color: string } }
  | {
      type: "ALIGN_TEXT";
      payload: { id: string; align: "left" | "center" | "right" };
    }
  | { type: "CHANGE_FONT_SIZE"; payload: { id: string; fontSize: number } }
  | { type: "CHANGE_LINE_HEIGHT"; payload: { id: string; lineHeight: number } }
  | {
      type: "CHANGE_LETTER_SPACING";
      payload: { id: string; letterSpacing: number };
    }

  // UI State
  | { type: "SET_ADD_MENU_VISIBLE"; payload: boolean }
  | {
      type: "OPEN_CONTEXT_MENU";
      payload: { blockId: string; x: number; y: number };
    }
  | { type: "CLOSE_CONTEXT_MENU" }
  | { type: "SET_CHAPTER_SLIDER_VISIBLE"; payload: boolean }

  // Clipboard
  | { type: "COPY_BLOCK"; payload: string }
  | { type: "PASTE_BLOCK" };

// Initial State
const initialState: JournalState = {
  blocks: [],
  selectedBlockId: null,
  addMenuVisible: false,
  contextMenu: {
    visible: false,
    blockId: null,
    x: 0,
    y: 0,
  },
  copiedBlock: null,
  chapterSliderVisible: false,
};

// Reducer Function
export function journalReducer(
  state: JournalState,
  action: JournalAction,
): JournalState {
  switch (action.type) {
    case "ADD_BLOCK":
      return {
        ...state,
        blocks: [...state.blocks, action.payload],
        selectedBlockId: action.payload.id,
      };

    case "UPDATE_BLOCK": {
      return {
        ...state,
        blocks: state.blocks.map((block) =>
          block.id === action.payload.id
            ? ({ ...block, ...action.payload.updates } as JournalBlock)
            : block,
        ),
      };
    }

    case "DELETE_BLOCK":
      return {
        ...state,
        blocks: state.blocks.filter((block) => block.id !== action.payload),
        selectedBlockId:
          state.selectedBlockId === action.payload
            ? null
            : state.selectedBlockId,
      };

    case "SET_BLOCKS":
      return {
        ...state,
        blocks: action.payload,
      };

    case "MOVE_BLOCK":
      return {
        ...state,
        blocks: state.blocks.map((block) =>
          block.id === action.payload.id
            ? { ...block, x: action.payload.x, y: action.payload.y }
            : block,
        ),
      };

    case "RESIZE_BLOCK":
      return {
        ...state,
        blocks: state.blocks.map((block) =>
          block.id === action.payload.id
            ? {
                ...block,
                width: action.payload.width,
                height: action.payload.height,
                x: action.payload.x,
                y: action.payload.y,
              }
            : block,
        ),
      };

    case "ROTATE_BLOCK":
      return {
        ...state,
        blocks: state.blocks.map((block) =>
          block.id === action.payload.id
            ? { ...block, rotation: action.payload.rotation }
            : block,
        ),
      };

    case "SELECT_BLOCK": {
      const maxZ =
        state.blocks.length > 0
          ? Math.max(...state.blocks.map((b) => b.zIndex))
          : 0;
      return {
        ...state,
        selectedBlockId: action.payload,
        blocks: state.blocks.map((block) =>
          block.id === action.payload ? { ...block, zIndex: maxZ + 1 } : block,
        ),
      };
    }

    case "DESELECT_BLOCK":
      return {
        ...state,
        selectedBlockId: null,
      };

    case "CHANGE_TEXT":
      return {
        ...state,
        blocks: state.blocks.map((block) =>
          block.id === action.payload.id && isTextBlock(block)
            ? { ...block, text: action.payload.text }
            : block,
        ),
      };

    case "TOGGLE_BOLD":
      return {
        ...state,
        blocks: state.blocks.map((block) =>
          block.id === action.payload && isTextBlock(block)
            ? { ...block, isBold: !block.isBold }
            : block,
        ),
      };

    case "TOGGLE_ITALIC":
      return {
        ...state,
        blocks: state.blocks.map((block) =>
          block.id === action.payload && isTextBlock(block)
            ? { ...block, isItalic: !block.isItalic }
            : block,
        ),
      };

    case "TOGGLE_UNDERLINE":
      return {
        ...state,
        blocks: state.blocks.map((block) =>
          block.id === action.payload && isTextBlock(block)
            ? { ...block, isUnderline: !block.isUnderline }
            : block,
        ),
      };

    case "CHANGE_COLOR":
      return {
        ...state,
        blocks: state.blocks.map((block) =>
          block.id === action.payload.id
            ? { ...block, textColor: action.payload.color }
            : block,
        ),
      };

    case "ALIGN_TEXT":
      return {
        ...state,
        blocks: state.blocks.map((block) =>
          block.id === action.payload.id
            ? { ...block, textAlign: action.payload.align }
            : block,
        ),
      };

    case "CHANGE_FONT_SIZE":
      return {
        ...state,
        blocks: state.blocks.map((block) =>
          block.id === action.payload.id
            ? { ...block, fontSize: action.payload.fontSize }
            : block,
        ),
      };

    case "CHANGE_LINE_HEIGHT":
      return {
        ...state,
        blocks: state.blocks.map((block) =>
          block.id === action.payload.id
            ? { ...block, lineHeight: action.payload.lineHeight }
            : block,
        ),
      };

    case "CHANGE_LETTER_SPACING":
      return {
        ...state,
        blocks: state.blocks.map((block) =>
          block.id === action.payload.id
            ? { ...block, letterSpacing: action.payload.letterSpacing }
            : block,
        ),
      };

    case "SET_ADD_MENU_VISIBLE":
      return {
        ...state,
        addMenuVisible: action.payload,
      };

    case "OPEN_CONTEXT_MENU":
      return {
        ...state,
        contextMenu: {
          visible: true,
          blockId: action.payload.blockId,
          x: action.payload.x,
          y: action.payload.y,
        },
      };

    case "CLOSE_CONTEXT_MENU":
      return {
        ...state,
        contextMenu: {
          visible: false,
          blockId: null,
          x: 0,
          y: 0,
        },
      };

    case "SET_CHAPTER_SLIDER_VISIBLE":
      return {
        ...state,
        chapterSliderVisible: action.payload,
      };

    case "COPY_BLOCK": {
      const block = state.blocks.find((b) => b.id === action.payload);
      return {
        ...state,
        copiedBlock: block || null,
        contextMenu: {
          visible: false,
          blockId: null,
          x: 0,
          y: 0,
        },
      };
    }

    case "PASTE_BLOCK": {
      if (!state.copiedBlock) return state;

      const newId = Date.now().toString();
      const maxZ =
        state.blocks.length > 0
          ? Math.max(...state.blocks.map((b) => b.zIndex))
          : 0;
      const newBlock = {
        ...state.copiedBlock,
        id: newId,
        x: state.copiedBlock.x + 30,
        y: state.copiedBlock.y + 30,
        zIndex: maxZ + 1,
      };

      return {
        ...state,
        blocks: [...state.blocks, newBlock],
        selectedBlockId: newId,
        contextMenu: {
          visible: false,
          blockId: null,
          x: 0,
          y: 0,
        },
      };
    }

    default:
      return state;
  }
}

// Context Interface
interface JournalContextValue {
  state: JournalState;
  dispatch: React.Dispatch<JournalAction>;
  // Helper actions
  addBlock: (block: JournalBlock) => void;
  updateBlock: (id: string, updates: Partial<JournalBlock>) => void;
  deleteBlock: (id: string) => void;
  setBlocks: (blocks: JournalBlock[]) => void;
  moveBlock: (id: string, x: number, y: number) => void;
  resizeBlock: (
    id: string,
    width: number,
    height: number,
    x: number,
    y: number,
  ) => void;
  rotateBlock: (id: string, rotation: number) => void;
  selectBlock: (id: string) => void;
  deselectBlock: () => void;
  changeText: (id: string, text: string) => void;
  toggleBold: (id: string) => void;
  toggleItalic: (id: string) => void;
  toggleUnderline: (id: string) => void;
  changeColor: (id: string, color: string) => void;
  alignText: (id: string, align: "left" | "center" | "right") => void;
  changeFontSize: (id: string, fontSize: number) => void;
  changeLineHeight: (id: string, lineHeight: number) => void;
  changeLetterSpacing: (id: string, letterSpacing: number) => void;
  setAddMenuVisible: (visible: boolean) => void;
  openContextMenu: (blockId: string, x: number, y: number) => void;
  closeContextMenu: () => void;
  setChapterSliderVisible: (visible: boolean) => void;
  copyBlock: (id: string) => void;
  pasteBlock: () => void;
}

// Create Context
const JournalContext = createContext<JournalContextValue | undefined>(
  undefined,
);

// Provider Component
export const JournalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(journalReducer, initialState);

  const value: JournalContextValue = {
    state,
    dispatch,
    // Helper functions
    addBlock: (block) => dispatch({ type: "ADD_BLOCK", payload: block }),
    updateBlock: (id, updates) =>
      dispatch({ type: "UPDATE_BLOCK", payload: { id, updates } }),
    deleteBlock: (id) => dispatch({ type: "DELETE_BLOCK", payload: id }),
    setBlocks: (blocks) => dispatch({ type: "SET_BLOCKS", payload: blocks }),
    moveBlock: (id, x, y) =>
      dispatch({ type: "MOVE_BLOCK", payload: { id, x, y } }),
    resizeBlock: (id, width, height, x, y) =>
      dispatch({ type: "RESIZE_BLOCK", payload: { id, width, height, x, y } }),
    rotateBlock: (id, rotation) =>
      dispatch({ type: "ROTATE_BLOCK", payload: { id, rotation } }),
    selectBlock: (id) => dispatch({ type: "SELECT_BLOCK", payload: id }),
    deselectBlock: () => dispatch({ type: "DESELECT_BLOCK" }),
    changeText: (id, text) =>
      dispatch({ type: "CHANGE_TEXT", payload: { id, text } }),
    toggleBold: (id) => dispatch({ type: "TOGGLE_BOLD", payload: id }),
    toggleItalic: (id) => dispatch({ type: "TOGGLE_ITALIC", payload: id }),
    toggleUnderline: (id) =>
      dispatch({ type: "TOGGLE_UNDERLINE", payload: id }),
    changeColor: (id, color) =>
      dispatch({ type: "CHANGE_COLOR", payload: { id, color } }),
    alignText: (id, align) =>
      dispatch({ type: "ALIGN_TEXT", payload: { id, align } }),
    changeFontSize: (id, fontSize) =>
      dispatch({ type: "CHANGE_FONT_SIZE", payload: { id, fontSize } }),
    changeLineHeight: (id, lineHeight) =>
      dispatch({ type: "CHANGE_LINE_HEIGHT", payload: { id, lineHeight } }),
    changeLetterSpacing: (id, letterSpacing) =>
      dispatch({
        type: "CHANGE_LETTER_SPACING",
        payload: { id, letterSpacing },
      }),
    setAddMenuVisible: (visible) =>
      dispatch({ type: "SET_ADD_MENU_VISIBLE", payload: visible }),
    openContextMenu: (blockId, x, y) =>
      dispatch({ type: "OPEN_CONTEXT_MENU", payload: { blockId, x, y } }),
    closeContextMenu: () => dispatch({ type: "CLOSE_CONTEXT_MENU" }),
    setChapterSliderVisible: (visible) =>
      dispatch({ type: "SET_CHAPTER_SLIDER_VISIBLE", payload: visible }),
    copyBlock: (id) => dispatch({ type: "COPY_BLOCK", payload: id }),
    pasteBlock: () => dispatch({ type: "PASTE_BLOCK" }),
  };

  return (
    <JournalContext.Provider value={value}>{children}</JournalContext.Provider>
  );
};

// Custom Hook
export const useJournal = () => {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error("useJournal must be used within JournalProvider");
  }
  return context;
};
