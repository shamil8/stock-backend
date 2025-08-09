import { JwtPayload } from 'jsonwebtoken';

import { UserRole } from '../../users/enums/user-role';

export interface JwtValidatePayloadInterface extends JwtPayload {
  id: string;
  email: string;
  name: string | undefined;
  role: UserRole;
}
