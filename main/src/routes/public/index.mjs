console.log('#routes/public/index')

import p from "#routes/public/p";
import db from "#routes/public/db";
import wizard from "#routes/public/wizard";

export default {
    'db':db,

    '':p,
  'wizard':wizard
};
