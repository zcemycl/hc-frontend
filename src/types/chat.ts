import { ApiResult } from "./api";

export interface IChatMessage {
  content: string;
  type: string;
}

export interface ChatMessageResult extends ApiResult<IChatMessage> {}
export interface ChatMessageHistoryResult extends ApiResult<IChatMessage[]> {}
