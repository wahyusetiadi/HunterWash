import React from 'react'

export const Date = () => {
    const today = new window.Date();
    const formatedDate = today.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
  return (
    <div>
        <p>{formatedDate}</p>
    </div>
  )
}
