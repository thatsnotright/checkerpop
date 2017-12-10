import React from 'react';

export default function(props) {
  const plural = props.checkins > 1 ? "s" : "";
  return (
    <div className="header">
      <p>Congratulations, {props.firstName} {props.lastName}!</p>
      <p>You have earned {props.points} points with {props.checkins} checkin{plural}!</p>
      <p>Keep it up!</p>
    </div>
  );
}
