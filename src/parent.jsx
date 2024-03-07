import React, { useEffect } from 'react';
import { useStore } from './useStore';

function Tree() {
  const { deriveParentChildrenRelation } = useStore();

  useEffect(() => {
    const jsonOutput = deriveParentChildrenRelation();
    console.log(JSON.stringify(jsonOutput, null, 2)); // Log JSON output to console
  }, [deriveParentChildrenRelation]);

  return null; // This component doesn't render anything, it just logs the JSON output
}

export default Tree;
