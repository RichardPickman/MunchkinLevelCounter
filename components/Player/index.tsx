import { Controls } from '../Controls';
import { sum } from './helpers'
import { Player as PlayerType } from '../../types/index'
import styles from './Player.module.css';

interface Props extends PlayerType {
    onClick: (data: Partial<PlayerType>) => void
}

export const Player = ({ onClick, playerId, isOwner, color, isActive, nickname, ...props }: Props) => (
    <div className={styles.root} style={{ background: color }}>
        <strong className={styles.nickname}>{nickname}</strong>
        <strong className={styles.total_power}>{sum(props)}</strong>
        <div className={styles.stats}>
            {Object.entries(props).map(([key, value], index) => <Controls name={key} value={value} onClick={onClick} key={index} />)}
        </div>
    </div>
);
