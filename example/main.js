import { foo } from './foo.js';
import userInfo from './user.json';

function main() {
  console.log('main');
  console.log(userInfo);
}
foo();
main();
