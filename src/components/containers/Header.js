import React from 'react';

export default function Header(props) {
  const { heading, description } = props;

  return (
    <header style={{ textAlign: 'center' }}>
      <h1 style={{ marginBotton: '5px' }}>{heading}</h1>
      <p style={{ marginBottom: '5px' }}>{description}</p>
    </header>
  );
}
