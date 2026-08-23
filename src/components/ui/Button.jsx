import React from 'react'; export function Button({children,variant='secondary',className='',...props}){return <button className={`btn btn-${variant} ${className}`} {...props}>{children}</button>}
