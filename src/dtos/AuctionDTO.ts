export interface AuctionRefreshDTO {
  method: string;
  body: {
    ws_id: number;
    cell_name: string;
    player_name: string;
    property_price: number;
  }
}
