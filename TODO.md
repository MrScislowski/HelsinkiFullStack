https://fullstackopen.com/en/part9/first_steps_with_type_script#exercises-9-1-9-3

9.2 Exercise calculator
Create the code of this exercise in file exerciseCalculator.ts.

Write a function calculateExercises that calculates the average time of daily exercise hours and compares it to the target amount of daily hours and returns an object that includes the following values:

the number of days
the number of training days
the original target value
the calculated average time
boolean value describing if the target was reached
a rating between the numbers 1-3 that tells how well the hours are met. You can decide on the metric on your own.
a text value explaining the rating, you can come up with the explanations
The daily exercise hours are given to the function as an array that contains the number of exercise hours for each day in the training period. Eg. a week with 3 hours of training on Monday, none on Tuesday, 2 hours on Wednesday, 4.5 hours on Thursday and so on would be represented by the following array:

[3, 0, 2, 4.5, 0, 3, 1]copy
For the Result object, you should create an interface.

If you call the function with parameters [3, 0, 2, 4.5, 0, 3, 1] and 2, it should return:

{ periodLength: 7,
trainingDays: 5,
success: false,
rating: 2,
ratingDescription: 'not too bad but could be better',
target: 2,
average: 1.9285714285714286 }copy
Create an npm script, npm run calculateExercises, to call the function with hard-coded values.

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
