import Image from "next/image";
import styles from "./page.module.css";
import WindowFrame from "@/components/WindowFrame/WindowFrame";
import Panel from "@/components/Panel/Panel";
import XPButton from "@/components/XPButton/XPButton";

export default function Home() {
  return (
    <div className={styles.container}>
      <WindowFrame title="Me and My Computer" width="650px">

        {/* Date/Time Header */}
        <div className={styles.topBar}>
          <span>Date: 13/1/26</span>
          <span>Time: 7:00</span>
        </div>

        <div className={styles.mainContent}>
          {/* Left Column */}
          <div className={styles.leftCol}>
            <Panel label="Personal Status">
              <StatRow label="Money:" value="122" />
              <StatRow label="Status:" value="Newbie" />
              <StatRow label="Job:" value="Loader" />
              <StatRow label="Mood:" value="3" />
              <StatRow label="Satiety:" value="-11" />
              <StatRow label="Education:" value="Basic" />
              <StatRow label="English:" value="None" />
            </Panel>

            <Panel label="Computer">
              <StatRow label="Monitor:" value="None" />
              <StatRow label="Printer:" value="None" />
              <StatRow label="Scanner:" value="None" />
              <StatRow label="Modem:" value="None" />
              <hr style={{ border: 0, borderTop: '1px solid #ACA899', margin: '2px 0' }} />
              <StatRow label="CPU:" value="Intel 486" />
              <StatRow label="HDD:" value="None" />
              <StatRow label="CD-ROM:" value="None" />
              <StatRow label="RAM:" value="None" />
              <StatRow label="Sound:" value="None" />
              <StatRow label="Video:" value="None" />
            </Panel>

            <div className={styles.infoBox}>
              Welcome to the game "Me and My Computer".
              The programmer of this game is Lewshev Yury.
            </div>
          </div>

          {/* Center Column */}
          <div className={styles.centerCol}>
            <Panel label="My Life">
              <StatRow label="Rooms:" value="2" />
              <StatRow label="Furniture:" value="Used" />
              <StatRow label="Kitchen:" value="Small" />
              <StatRow label="Bathroom:" value="Bucket" />
              <StatRow label="Clothes:" value="Ragged" />
              <StatRow label="Car:" value="No car" />
            </Panel>

            <Panel label="Programs">
              <StatRow label="System:" value="None" />
              <StatRow label="Office:" value="None" />
              <StatRow label="Graphics:" value="None" />
              <StatRow label="Antivirus:" value="None" />
            </Panel>

            <Panel label="Internet">
              <StatRow label="Access:" value="None" />
            </Panel>

            <Panel label="Job">
              <StatRow label="Loader" value="Salary: 10" />
            </Panel>

            <Panel label="Education">
              <div>School</div>
              <StatRow label="Not studying" value="Cost: 0" />
              <div>English</div>
              <StatRow label="Not studying" value="Cost: 0" />
              <div>Courses</div>
              <StatRow label="Not studying" value="Cost: 0" />
            </Panel>
          </div>

          {/* Right Column (Buttons) */}
          <div className={styles.rightCol}>
            <XPButton variant="primary">Apartment</XPButton>
            <XPButton variant="primary">Shop</XPButton>
            <XPButton variant="primary">Entertainment</XPButton>
            <XPButton variant="primary">Hobby</XPButton>
            <XPButton variant="primary">Education</XPButton>
            <XPButton variant="primary">Job</XPButton>
            <XPButton variant="primary">Bank</XPButton>
            <br />
            <XPButton variant="primary">Computer</XPButton>
            <XPButton variant="primary">Programs</XPButton>
            <XPButton variant="primary">Internet</XPButton>
            <br />
            <XPButton variant="primary">Hacking</XPButton>
          </div>
        </div>

      </WindowFrame>
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
