interface RealmRecord {
  category: string;
  value: number;
  heldBy: string[];
}

interface Realm {
  record: number;
  week: string;
  categories: Record<string, RealmRecord[]>;
}

function loadRealm(): Realm;
function loadRealm(realm: Realm): void;
function loadRealm(realm?: Realm): Realm | void {
  if (realm === undefined) {
    return Object.assign(
      {
        record: 0.0,
        week: '',
        categories: {}
      },
      channelCustomData.get('gofishgame')
    );
  }

  channelCustomData.set('gofishgame', realm as Realm & Record<string, SupibotStoreValue>);
}
