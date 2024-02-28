import { useState, useEffect } from 'react';
import Notiflix from 'notiflix';
import { nanoid } from 'nanoid';
import { ContactForm } from './ContactForm/ContactForm';
import { ContactsList } from './ContactList/ContactList';
import { Filter } from './Filter/Filter';

export function App() {
  const [contacts, setContacts] = useState(
    JSON.parse(localStorage.getItem('contacts')) ?? []
  );
  const [filter, setFilter] = useState('');

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  function formSubmitHandler(data) {
    for (const contact of contacts) {
      if (data.name.toLowerCase() === contact.name.toLowerCase()) {
        return Notiflix.Notify.failure(`${data.name} is already in contact`);
      } else if (data.number.toLowerCase() === contact.number.toLowerCase()) {
        return Notiflix.Notify.failure(`${data.number} is already in contact`);
      } else {
        setContacts([...contacts, { ...data, id: nanoid() }]);
        return Notiflix.Notify.success('Contact added');
      }
    }
  }

  function onFilter(e) {
    setFilter(e.target.value);
  }

  function getVisibleContacts(contacts, filter) {
    const normalizedFilter = filter.toLowerCase();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter)
    );
  }

  function deleteContact(contactId, contactName) {
    setContacts(contacts.filter(contact => contact.id !== contactId));
    Notiflix.Notify.success(`Contact ${contactName} deleted successfully`);
  }

  return (
    <div className="container">
      <h1>PhoneBook</h1>
      <ContactForm onSubmit={formSubmitHandler} />

      <div>
        <h2>Contacts</h2>
        <Filter value={filter} onFilter={onFilter} />
        {contacts.length > 0 && (
          <ContactsList
            contacts={getVisibleContacts(contacts, filter)}
            onDeleteContact={deleteContact}
          />
        )}
      </div>
    </div>
  );
}
