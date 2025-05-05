## Ideas for Improvement this small application

- Ideally, the application could include a dropdown for selecting different currencies, including various cryptocurrencies besides BTC. Each time a new currency is selected, it would fetch the current rate.

- Some constants used to limit values are stored in useExchangeForm.ts. These could be moved to an .env file in the future.

- Both the "Success" and form buttons could share the same CSS components, as they are quite similar.

- Additional CSS variables could be introduced, for example, to manage spacing and padding more consistently across elements.

- I considered adding a "Dark Mode" toggle to switch between a dark and standard layout. However, I see it as a "nice-to-have" feature that would significantly increase development time for something not originally requested.

- A check could be added to revalidate the selected currency before submitting, in case it changed, allowing the user to confirm the updated transaction values.
