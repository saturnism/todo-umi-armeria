import React from 'react';
import { formatMessage } from 'umi-plugin-locale';

export default function() {
  return (
    <div>
      {formatMessage({
        id: 'index.hello-world'
      })}
    </div>
  );
}
