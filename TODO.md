https://fullstackopen.com/en/part9/first_steps_with_type_script#more-about-tsconfig

9.5 WebBMI
Add an endpoint for the BMI calculator that can be used by doing an HTTP GET request to the endpoint bmi and specifying the input with query string parameters. For example, to get the BMI of a person with a height of 180 and a weight of 72, the URL is http://localhost:3002/bmi?height=180&weight=72.

The response is a JSON of the form:

{
weight: 72,
height: 180,
bmi: "Normal (healthy weight)"
}copy
See the Express documentation for info on how to access the query parameters.

If the query parameters of the request are of the wrong type or missing, a response with proper status code and an error message is given:

{
error: "malformatted parameters"
}copy
Do not copy the calculator code to file index.ts; instead, make it a TypeScript module that can be imported into index.ts.
