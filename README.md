# Vas-Dashboard

Jest to mała aplikacja napisana za pomocą React. Napisałem ją jako część projektu mierzenia produktywności na dziale VAS na magazynie odzieżowym.
Aplikacja komunikuje się lokalnie z serwerem (/server.js - użyłem Express.js) który pobiera dane z bazy MySQL i przekazuje je do aplikacji aby wyświetlić je w formie tabeli. Użytkownik może wybrać przedział czasowy dla tych danych (np dziś, albo cały poprzedni tydzień)
Ma tez możliwość eksportowania wyniku do pliku xlsx. Na podstronie aplikacji (sztucznej podstronie, jest to one-page-app) można znaleźć ustawienia, gdzie za pomocą suwaków użytkownik może zmienić wagi poszczególnych procedur VAS, aby punktacja pracownika brała pod uwagę trudność procedury.

Do kolekcjonowania danych służy aplikacja https://github.com/vedymin/VasProductivity
