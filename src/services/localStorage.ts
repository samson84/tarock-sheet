import { ApplicationError } from "../lib/error";

export const PREFIX = "tarockSheetState_v2";

export class NotSupportedStorageError extends ApplicationError {
  constructor(message?: string) {
    super(message, "Saving is not supported!");
    this.name = "NotSupportedStorageError";
  }
}

export class WrongDataStorageError extends ApplicationError {
  constructor(message?: string) {
    super(
      message,
      "Not able to save or load your changes! It is an application error!"
    );
    this.name = "WrongDataStorageError";
  }
}

export class UnsuccessfulSavingStorageError extends ApplicationError {
  constructor(message?: string) {
    super(message, "Not able to save your changes! Maybe the storage is full.");
    this.name = "UnsuccessfulSavingStorageError";
  }
}

interface Storage {
  isSupported: () => {};
  create: (key: string, data: object) => void;
  update: (key: string, data: object) => void;
  delete: (key: string) => void;
  read: (key: string) => object | null;
}
export const storage = (prefix: string = PREFIX): Storage => {
  const isSupported = () => Boolean(window.localStorage);
  const _checkSupport = () => {
    if (!isSupported()) {
      throw new NotSupportedStorageError();
    }
  };
  const _instance = window.localStorage;
  const _serialize = (data: object): string => {
    try {
      return JSON.stringify(data);
    } catch (error) {
      throw new WrongDataStorageError(error.message);
    }
  };
  const _unserialize = (str: string): object => {
    try {
      return JSON.parse(str);
    } catch (error) {
      throw new WrongDataStorageError(error.message);
    }
  };
  const getStorageKey = (key: string): string => `${prefix}_${key}`;

  const create = (key: string, data: object) => {
    _checkSupport();
    try {
      _instance.setItem(getStorageKey(key), _serialize(data));
    } catch (error) {
      if (error instanceof WrongDataStorageError) {
        throw error;
      }
      throw new UnsuccessfulSavingStorageError(error.message);
    }
  };
  const remove = (key: string) => {
    _checkSupport();
    _instance.removeItem(key);
  };
  const read = (key: string): object | null => {
    _checkSupport();
    const serialized = _instance.getItem(getStorageKey(key));
    return serialized === null ? null : _unserialize(serialized);
  };

  return {
    isSupported,
    create,
    update: create,
    delete: remove,
    read,
  };
};
