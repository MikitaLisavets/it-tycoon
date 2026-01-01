"use client";

import { useState } from "react";
import { useTranslations } from 'next-intl';
import Image from "next/image";
import styles from "./page.module.css";
import WindowFrame from "@/components/WindowFrame/WindowFrame";
import Panel from "@/components/Panel/Panel";
import XPButton from "@/components/XPButton/XPButton";
import Taskbar from "@/components/Taskbar/Taskbar";
import OnboardingModal from "@/components/OnboardingModal/OnboardingModal";
import ResetModal from "@/components/ResetModal/ResetModal";

export default function Home() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const t = useTranslations('Game');

  const handleReset = () => {
    // Current reset logic: just reload the page.
    // In the future, this might involve clearing localStorage.
    window.location.reload();
  };

  return (
    <div className={styles.container}>
      <div className={styles.desktopArea}>
        <WindowFrame
          title={t('me_and_my_computer')}
          width="650px"
          onHelpClick={() => setIsHelpOpen(true)}
          onCloseClick={() => setIsResetOpen(true)}
        >
          {/* ... existing window content ... */}


          <div className={styles.mainContent}>
            {/* Left Column */}
            <div className={styles.leftCol}>
              <Panel label={t('panels.personal_status')}>
                <StatRow label={t('money')} value="122" />
                <StatRow label={t('status')} value={t('values.newbie')} />
                <StatRow label={t('job')} value={t('values.loader')} />
                <StatRow label={t('mood')} value="3" />
                <StatRow label={t('satiety')} value="-11" />
                <StatRow label={t('education')} value={t('values.basic')} />
                <StatRow label={t('english')} value={t('values.none')} />
              </Panel>

              <Panel label={t('panels.computer')}>
                <StatRow label={t('monitor')} value={t('values.none')} />
                <StatRow label={t('printer')} value={t('values.none')} />
                <StatRow label={t('scanner')} value={t('values.none')} />
                <StatRow label={t('modem')} value={t('values.none')} />
                <hr style={{ border: 0, borderTop: '1px solid #ACA899', margin: '2px 0' }} />
                <StatRow label={t('cpu')} value={t('values.intel_486')} />
                <StatRow label={t('hdd')} value={t('values.none')} />
                <StatRow label={t('cd_rom')} value={t('values.none')} />
                <StatRow label={t('ram')} value={t('values.none')} />
                <StatRow label={t('sound')} value={t('values.none')} />
                <StatRow label={t('video')} value={t('values.none')} />
              </Panel>

              <div className={styles.infoBox}>
                {t('welcome_msg')}
                <br />
                {t('programmer_msg')}
              </div>
            </div>

            {/* Center Column */}
            <div className={styles.centerCol}>
              <Panel label={t('panels.my_life')}>
                <StatRow label={t('rooms')} value="2" />
                <StatRow label={t('furniture')} value={t('values.used')} />
                <StatRow label={t('kitchen')} value={t('values.small')} />
                <StatRow label={t('bathroom')} value={t('values.bucket')} />
                <StatRow label={t('clothes')} value={t('values.ragged')} />
                <StatRow label={t('car')} value={t('values.no_car')} />
              </Panel>

              <Panel label={t('panels.programs')}>
                <StatRow label={t('system')} value={t('values.none')} />
                <StatRow label={t('office')} value={t('values.none')} />
                <StatRow label={t('graphics')} value={t('values.none')} />
                <StatRow label={t('antivirus')} value={t('values.none')} />
              </Panel>

              <Panel label={t('panels.internet')}>
                <StatRow label={t('access')} value={t('values.none')} />
              </Panel>

              <Panel label={t('panels.job')}>
                <StatRow label={t('values.loader')} value={`${t('salary')} 10`} />
              </Panel>

              <Panel label={t('panels.education')}>
                <div>{t('school')}</div>
                <StatRow label={t('not_studying')} value={`${t('cost')} 0`} />
                <div>{t('english')}</div>
                <StatRow label={t('not_studying')} value={`${t('cost')} 0`} />
                <div>{t('courses')}</div>
                <StatRow label={t('not_studying')} value={`${t('cost')} 0`} />
              </Panel>
            </div>

            {/* Right Column (Buttons) */}
            <div className={styles.rightCol}>
              <XPButton variant="primary">{t('buttons.apartment')}</XPButton>
              <XPButton variant="primary">{t('buttons.shop')}</XPButton>
              <XPButton variant="primary">{t('buttons.entertainment')}</XPButton>
              <XPButton variant="primary">{t('buttons.hobby')}</XPButton>
              <XPButton variant="primary">{t('buttons.education')}</XPButton>
              <XPButton variant="primary">{t('buttons.job')}</XPButton>
              <XPButton variant="primary">{t('buttons.bank')}</XPButton>
              <br />
              <XPButton variant="primary">{t('buttons.computer')}</XPButton>
              <XPButton variant="primary">{t('buttons.programs')}</XPButton>
              <XPButton variant="primary">{t('buttons.internet')}</XPButton>
              <br />
              <XPButton variant="primary">{t('buttons.hacking')}</XPButton>
            </div>
          </div>

        </WindowFrame>
      </div>
      <Taskbar date="13/1/26" time="7:00" />
      <OnboardingModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <ResetModal
        isOpen={isResetOpen}
        onConfirm={handleReset}
        onCancel={() => setIsResetOpen(false)}
      />
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.statRow}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{value}</span>
    </div>
  );
}
