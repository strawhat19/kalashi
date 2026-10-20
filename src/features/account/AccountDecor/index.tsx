import { Text, View } from 'react-native';
import { element } from '../ui';
import { styles } from './styles.native';

export const RecordMark = ({ id }: { id: string }) => (
  <View {...element(`record-mark`, id)} style={styles.record} accessibilityElementsHidden importantForAccessibility={`no-hide-descendants`}>
    <View {...element(`record-mark-groove`, id)} style={styles.recordGroove}>
      <View {...element(`record-mark-label`, id)} style={styles.recordLabel}>
        <Text {...element(`record-mark-letter`, id)} style={styles.recordLetter}>{`K`}</Text>
      </View>
    </View>
  </View>
);

export const Cassette = ({ id, title, number = `01` }: { id: string; title: string; number?: string }) => (
  <View {...element(`mixtape-art`, id)} style={styles.cassette} accessibilityElementsHidden importantForAccessibility={`no-hide-descendants`}>
    <View {...element(`mixtape-label`, id)} style={styles.cassetteLabel}>
      <Text {...element(`mixtape-side`, id)} style={styles.cassetteSide}>{`SIDE A / ${number}`}</Text>
      <Text {...element(`mixtape-name`, id)} numberOfLines={1} style={styles.cassetteName}>{title}</Text>
    </View>
    <View {...element(`mixtape-window`, id)} style={styles.cassetteWindow}>
      <View {...element(`mixtape-reel`, `${id}-left`)} style={styles.cassetteReel}><View {...element(`mixtape-hub`, `${id}-left`)} style={styles.cassetteHub} /></View>
      <View {...element(`mixtape-tape`, id)} style={styles.cassetteTape} />
      <View {...element(`mixtape-reel`, `${id}-right`)} style={styles.cassetteReel}><View {...element(`mixtape-hub`, `${id}-right`)} style={styles.cassetteHub} /></View>
    </View>
    <View {...element(`mixtape-base`, id)} style={styles.cassetteBase} />
  </View>
);

export const Admission = ({ mode, id }: { mode: `sign-in` | `sign-up` | `forgot-password`; id: string }) => {
  const signup = mode === `sign-up`;
  const recovery = mode === `forgot-password`;
  return <View {...element(`admission-ticket`, id)} style={[styles.ticket, signup && styles.ticketSignup, recovery && styles.ticketRecovery]}>
    <View {...element(`admission-top`, id)} style={styles.ticketTop}>
      <Text {...element(`admission-brand`, id)} style={styles.ticketSmall}>{`KALASHI / MUSIC`}</Text>
      <Text {...element(`admission-type`, id)} style={styles.ticketSmall}>{recovery ? `HELP DESK` : signup ? `ADMIT ONE` : `RE-ENTRY`}</Text>
    </View>
    <Text {...element(`admission-slogan`, id)} style={styles.ticketSlogan}>{recovery ? `LOST YOUR\nFREQUENCY?` : signup ? `YOU’RE\nON THE\nLIST.` : `BACK\nFOR AN\nENCORE.`}</Text>
    <Text {...element(`admission-note`, id)} style={styles.ticketNote}>{recovery ? `A little help getting back to the records you love.` : signup ? `A place for your records, your moods, and everything on repeat.` : `Your favorites are right where you left them.`}</Text>
    <View {...element(`admission-stub`, id)} style={styles.ticketStub}>
      <View {...element(`admission-bars`, id)} style={styles.ticketBars} accessibilityElementsHidden importantForAccessibility={`no-hide-descendants`}>
        {[3, 7, 2, 4, 8, 3, 5, 2, 7, 4, 3, 8, 2, 5, 3, 6].map((width, index) => <View {...element(`admission-bar`, `${id}-${index}`)} key={index} style={[styles.ticketBar, { width }]} />)}
      </View>
      <Text {...element(`admission-stub-label`, id)} style={styles.ticketSmall}>{`NO BAD SEATS.\nJUST GOOD MUSIC.`}</Text>
    </View>
  </View>;
};

export const Passport = ({ id, name, email, joined, role, number }: { id: string; name: string; email: string; joined: string; role: string; number: number }) => (
  <View {...element(`listener-passport`, id)} style={styles.passport}>
    <View {...element(`passport-top`, id)} style={styles.passportTop}>
      <Text {...element(`passport-brand`, id)} style={styles.passportSmall}>{`KALASHI / LISTENER PASSPORT`}</Text>
      <Text {...element(`passport-number`, id)} style={styles.passportSmall}>{`NO. ${String(number).padStart(4, `0`)}`}</Text>
    </View>
    <View {...element(`passport-body`, id)} style={styles.passportBody}>
      <View {...element(`passport-portrait`, id)} style={styles.passportPortrait}>
        <Text {...element(`passport-initial`, id)} style={styles.passportInitial}>{name.trim().slice(0, 1).toUpperCase() || `K`}</Text>
        <Text {...element(`passport-portrait-label`, id)} style={styles.passportSmall}>{`LISTENER`}</Text>
      </View>
      <View {...element(`passport-identity`, id)} style={styles.passportIdentity}>
        <Text {...element(`passport-name-label`, id)} style={styles.passportSmall}>{`NAME / DISPLAY NAME`}</Text>
        <Text {...element(`passport-name`, id)} style={styles.passportName}>{name}</Text>
        <Text {...element(`passport-email`, id)} style={styles.passportEmail}>{email}</Text>
        <Text {...element(`passport-issued`, id)} style={styles.passportSmall}>{`ISSUED ${joined} / ${role.toUpperCase()}`}</Text>
      </View>
    </View>
    <Text {...element(`passport-signature`, id)} style={styles.passportSignature}>{`BANGLADESH ROOTS. ATLANTA ENERGY. YOUR FREQUENCY.`}</Text>
  </View>
);

export const Patchbay = ({ id, labels }: { id: string; labels: readonly string[] }) => (
  <View {...element(`account-patchbay`, id)} style={styles.patchbay} accessibilityElementsHidden importantForAccessibility={`no-hide-descendants`}>
    {labels.map((label, index) => <View {...element(`patchbay-channel`, `${id}-${index}`)} key={label} style={styles.patchbayChannel}>
      <Text {...element(`patchbay-number`, `${id}-${index}`)} style={styles.patchbayNumber}>{String(index + 1).padStart(2, `0`)}</Text>
      <View {...element(`patchbay-port`, `${id}-${index}`)} style={styles.patchbayPort}><View {...element(`patchbay-center`, `${id}-${index}`)} style={styles.patchbayCenter} /></View>
      <Text {...element(`patchbay-label`, `${id}-${index}`)} style={styles.patchbayLabel}>{label}</Text>
    </View>)}
  </View>
);

export const StudioDoor = ({ id, label }: { id: string; label: string }) => (
  <View {...element(`studio-door`, id)} style={styles.studioDoor} accessibilityElementsHidden importantForAccessibility={`no-hide-descendants`}>
    <View {...element(`studio-door-light`, id)} style={styles.studioLight}><Text {...element(`studio-door-light-label`, id)} style={styles.studioLightText}>{`STUDIO ACCESS`}</Text></View>
    <Text {...element(`studio-door-number`, id)} style={styles.studioNumber}>{`K / S`}</Text>
    <Text {...element(`studio-door-label`, id)} style={styles.studioLabel}>{label.toUpperCase()}</Text>
    <View {...element(`studio-door-handle`, id)} style={styles.studioHandle} />
    <Text {...element(`studio-door-note`, id)} style={styles.studioNote}>{`THE WORK BEHIND THE RECORDS.`}</Text>
  </View>
);
