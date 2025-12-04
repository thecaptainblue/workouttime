import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { InterstitialAd, AdEventType, TestIds, AdsConsent, AdsConsentStatus, AdsConsentDebugGeography } from 'react-native-google-mobile-ads';
import Config from '../@types/config/Config';
import { LogService } from '../services/Log/LogService';
import LogHelper from '../helper/LogHelper';

// const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyyyyyyyy';
// const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : Config.adUnitId;
const adUnitId = Config.adUnitId;
const isConsentActive = false

interface AdContextType {
  showInterstitialAd: () => void;
  isInterstitialAdLoaded: boolean;
}

// possible error codes
// type GoogleMobileAdsErrorCode =
//   | 'googleMobileAds/internal-error'
//   | 'googleMobileAds/invalid-request'
//   | 'googleMobileAds/network-error'
//   | 'googleMobileAds/no-fill'
//   | 'googleMobileAds/ad-already-loaded'
//   | 'googleMobileAds/ad-not-loaded'
//   | 'googleMobileAds/ad-failed-to-present'
//   | 'googleMobileAds/ad-dismissed'
//   | 'googleMobileAds/ad-presented';

enum AdErrorCode {
  nofill = "googleMobileAds/no-fill"
}

interface AdErrorCustom extends Error {
  code: string;
}

const AdContext = createContext<AdContextType | undefined>(undefined);

export const AdProvider = ({ children }: { children: React.ReactNode }) => {
  const interstitialAdRef = useRef<InterstitialAd | null>(null);
  const [isAdLoaded, setAdLoaded] = useState(false);

  const loadAd = (consentStatus: AdsConsentStatus | null) => {
    if (interstitialAdRef.current && interstitialAdRef.current.loaded) {
      setAdLoaded(true);
      return;
    }

    if (interstitialAdRef.current) {
      return;
    }

    const adRequestOptions = {
      // requestNonPersonalizedAdsOnly: !(consentStatus == AdsConsentStatus.NOT_REQUIRED || consentStatus == AdsConsentStatus.OBTAINED)
      requestNonPersonalizedAdsOnly: true

    };

    // LogService.infoFormat('AdProvider; adRequestOptions:', LogHelper.toString(adRequestOptions))
    console.log('AdProvider; adRequestOptions:', adRequestOptions);
    interstitialAdRef.current = InterstitialAd.createForAdRequest(adUnitId, adRequestOptions);

    interstitialAdRef.current.addAdEventListener(AdEventType.LOADED, () => {
      console.log('Interstitial Ad loaded!');
      setAdLoaded(true);
    });

    interstitialAdRef.current.addAdEventListener(AdEventType.ERROR, (error) => {
      // The common code for 'No Fill' is 3 in many ad SDKs.
      // We also check the message for safety.
      const adError = error as AdErrorCustom;
      console.log(' aderror ; ', LogHelper.toString(adError))
      if (adError.code === AdErrorCode.nofill) {
        // Log a simple, non-red warning, or suppress it entirely
        console.log('Google Mobile Ads Warning: Ad request successful, but received "No Fill".');
      } else {
        console.error('Interstitial Ad failed to load:', error);
      }

      interstitialAdRef.current = null;
      setAdLoaded(false);
    });

    interstitialAdRef.current.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('Interstitial Ad closed. Pre-loading the next ad...');
      interstitialAdRef.current = null;
      // Re-load the ad with the current consent status
      AdsConsent.getConsentInfo().then(info => loadAd(info.status));
    });

    interstitialAdRef.current.load();
  };

  useEffect(() => {
    if (isConsentActive) {
      async function handleConsent() {
        console.log('AdProvider; handleConsent called');
        try {
          const consentInfo = await AdsConsent.requestInfoUpdate({
            // testing regional consents comment for release
            // debugGeography: AdsConsentDebugGeography.EEA, // todo consent formunu test edecegim.
          });

          if (consentInfo.status === AdsConsentStatus.REQUIRED) {
            if (consentInfo.isConsentFormAvailable) {
              await AdsConsent.loadAndShowConsentFormIfRequired();
            } else {
              console.warn('Consent form not available.');
            }
          }

          // Load the ad after the consent process is complete
          const updatedConsentInfo = await AdsConsent.getConsentInfo();
          // LogService.infoFormat('handleConsent updatedConsentInfo:', LogHelper.toString(updatedConsentInfo))
          console.log('handleConsent updatedConsentInfo:', updatedConsentInfo);
          loadAd(updatedConsentInfo.status);

        } catch (error) {
          console.error('Consent process failed:', error);
          // Fallback to loading ads, but be cautious with personalization.
          const fallbackInfo = await AdsConsent.getConsentInfo();
          loadAd(fallbackInfo.status);
        }
      }

      handleConsent();
    } else {
      loadAd(null);
    }

    return () => {
      if (interstitialAdRef.current) {
        interstitialAdRef.current = null;
      }
    };
  }, []);

  const showAd = () => {
    if (interstitialAdRef.current && isAdLoaded) {
      interstitialAdRef.current.show();
    } else {
      console.log('Interstitial Ad is not ready to be shown.');
    }
  };

  const value = {
    showInterstitialAd: showAd,
    isInterstitialAdLoaded: isAdLoaded,
  };

  return <AdContext.Provider value={value}>{children}</AdContext.Provider>;
};

export const useAd = () => {
  const context = useContext(AdContext);
  if (context === undefined) {
    throw new Error('useAd must be used within an AdProvider');
  }
  return context;
};