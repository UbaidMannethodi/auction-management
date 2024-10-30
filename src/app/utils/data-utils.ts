export class DataUtils {

  public static playerPositions = [
    {id: 'goalKeeper', name: 'Goal Keeper'},
    {id: 'forward', name: 'Forward'},
    {id: 'defender', name: 'Defender'},
  ]

  public static getPosition(positionID: string): string {
    const positions = DataUtils.playerPositions;
    return positions.find( position => position.id === positionID)?.name;
  }


}
