https://fullstackopen.com/en/part9/first_steps_with_type_script#exercises-9-1-9-3

9.3 Command line
Change the previous exercises so that you can give the parameters of bmiCalculator and exerciseCalculator as command-line arguments.

Your program could work eg. as follows:

$ npm run calculateBmi 180 91

Overweightcopy
and:

$ npm run calculateExercises 2 1 0 2 4.5 0 3 1 0 4

{ periodLength: 9,
trainingDays: 6,
success: false,
rating: 2,
ratingDescription: 'not too bad but could be better',
target: 2,
average: 1.7222222222222223 }copy
In the example, the first argument is the target value.

Handle exceptions and errors appropriately. The exerciseCalculator should accept inputs of varied lengths. Determine by yourself how you manage to collect all needed input.

Couple of things to notice:

If you define helper functions in other modules, you should use the JavaScript module system, that is, the one we have used with React where importing is done with

import { isNotNumber } from "./utils";copy
and exporting

export const isNotNumber = (argument: any): boolean =>
isNaN(Number(argument));

default export "this is the default..."copy
Another note: somehow surprisingly TypeScript does not allow to define the same variable in many files at a "block-scope", that is, outside functions (or classes):

browser showing pong from localhost:3000/ping
This is actually not quite true. This rule applies only to files that are treated as "scripts". A file is a script if it does not contain any export or import statements. If a file has those, then the file is treated as a module, and the variables do not get defined in the block-scope.
