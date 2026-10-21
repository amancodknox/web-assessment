import React from 'react';
import { WalletOutlined } from '@ant-design/icons';
import { colors } from '../theme';

export const Logo: React.FC<{ size?: number }> = ({ size = 34 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.28,
      background: `linear-gradient(135deg, ${colors.primary}, #7c3aed)`,
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.5,
      flex: 'none',
    }}
  >
    <WalletOutlined />
  </div>
);
