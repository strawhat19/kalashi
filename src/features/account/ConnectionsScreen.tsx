import { Text, View } from 'react-native';
import { artist, latestRelease } from '../../config/artist';
import { useAuth } from '../../shared/account/AuthContext';
import AccountShell from './AccountShell';
import { Patchbay } from './AccountDecor';
import { pageStyles } from './pageStyles';
import { AccountLink, Copy, Panel, element } from './ui';

const ConnectionsScreen = () => {
  const { user, loading } = useAuth();

  return <AccountShell title={`Your connections.`} description={`Your account on one side. Your next listening session on the other.`}>
    <Patchbay id={`connections`} labels={[`ACCOUNT`, `SPOTIFY`, `AMAZON`]} />
    <View {...element(`connections-endpoints`)} style={pageStyles.connectionsGrid}>
      <Panel id={`connections-account`} number={`01`} eyebrow={`ACCOUNT / SIGN-IN METHOD`} title={loading ? `Loading Account…` : `Your way in.`}>
        {user ? <>
          <Text {...element(`connections-account-method`)} style={pageStyles.endpointHeading}>{`EMAIL & PASSWORD`}</Text>
          <Copy id={`connections-email`}>{user.email}</Copy>
          <AccountLink id={`connections-settings`} href={`/settings`} label={`⚙ Manage account & password`} />
        </> : <>
          <Copy id={`connections-sign-in-copy`}>{`Sign in to manage your account.`}</Copy>
          <AccountLink id={`connections-sign-in`} href={`/sign-in`} label={`↗ Sign in`} />
          <AccountLink id={`connections-sign-up`} href={`/sign-up`} label={`+ Create account`} />
        </>}
      </Panel>
      <View {...element(`connection-endpoint`, `spotify`)} style={pageStyles.connectionEndpoint}>
        <Text {...element(`connection-endpoint-label`, `spotify`)} style={pageStyles.endpointHeading}>{`02 / LISTENING ROUTE`}</Text>
        <Text {...element(`connection-endpoint-title`, `spotify`)} accessibilityRole={`header`} style={pageStyles.endpointTitle}>{`The full rotation.`}</Text>
        <Copy id={`connections-spotify-copy`}>{`Find Kalashi’s artist page, releases, and top tracks on Spotify.`}</Copy>
        <AccountLink id={`connections-spotify-link`} href={artist.spotifyUrl} label={`↗ Open Spotify`} />
        <Text {...element(`connection-endpoint-note`, `spotify`)} style={pageStyles.smallLabel}>{`EXTERNAL MUSIC LINK`}</Text>
      </View>
      <View {...element(`connection-endpoint`, `amazon`)} style={pageStyles.connectionEndpoint}>
        <Text {...element(`connection-endpoint-label`, `amazon`)} style={pageStyles.endpointHeading}>{`03 / LATEST RELEASE`}</Text>
        <Text {...element(`connection-endpoint-title`, `amazon`)} accessibilityRole={`header`} style={pageStyles.endpointTitle}>{latestRelease.title}</Text>
        <Copy id={`connections-amazon-copy`}>{`Open the latest single on Amazon Music and let it find its place on repeat.`}</Copy>
        <AccountLink id={`connections-amazon-link`} href={latestRelease.listeningUrl} label={`↗ Open Amazon Music`} />
        <Text {...element(`connection-endpoint-note`, `amazon`)} style={pageStyles.smallLabel}>{`EXTERNAL MUSIC LINK`}</Text>
      </View>
    </View>
    <Text {...element(`connections-note`)} style={pageStyles.routeNote}>{`Listening links open the music service. Playback and service sign-in happen there.`}</Text>
  </AccountShell>;
};

export default ConnectionsScreen;
