# Modèle Conceptuel de Données (MCD)
## Système de Gestion de Rendez-vous Médicaux

---

## MCD (Format Merise)

```
UTILISATEUR: _id, email, mot de passe, nom, prenom, telephone, date naissance, adresse, role, est actif, date creation, date mise a jour, theme, langue, preferences notif email, preferences notif sms
PRENDRE, 1N [patient] UTILISATEUR, 11 RENDEZVOUS
ASSURER, 1N [medecin] UTILISATEUR, 11 RENDEZVOUS
RENDEZVOUS: _id, date heure, motif, statut, notes, date creation, date mise a jour
CRENEAU_HORAIRE: _id, jour, heure debut, heure fin, est actif, date creation
DEFINIR, 1N [medecin] UTILISATEUR, 11 CRENEAU_HORAIRE
INDISPONIBILITE: _id, date debut, date fin, motif, date creation
DECLARER, 1N [medecin] UTILISATEUR, 11 INDISPONIBILITE
NOTE_MEDICALE: _id, titre, contenu, statut, pieces jointes, date creation, date mise a jour
REDIGER, 1N [medecin] UTILISATEUR, 11 NOTE_MEDICALE
CONCERNER, 1N [patient] UTILISATEUR, 11 NOTE_MEDICALE
NOTIFICATION: _id, type, titre, message, est lue, date creation
RECEVOIR, 1N UTILISATEUR, 11 NOTIFICATION

MEDECIN: specialite, numero ordre, statut validation
DF, _11 MEDECIN, 11 UTILISATEUR
```

---

## Légende des Cardinalités

- `11` = (1,1) - obligatoire et unique
- `1N` = (1,n) - obligatoire et multiple
- `0N` = (0,n) - optionnel et multiple
- `01` = (0,1) - optionnel et unique
- `DF` = Dépendance Fonctionnelle (spécialisation/héritage)

---

## Règles de Gestion

1. **RG1**: Un utilisateur possède un rôle unique parmi PATIENT, MEDECIN ou ADMIN
2. **RG2**: Seuls les médecins avec statut "APPROVED" peuvent recevoir des rendez-vous
3. **RG3**: Un patient ne peut pas confirmer ses propres rendez-vous (seul le médecin peut)
4. **RG4**: Un patient peut uniquement annuler ses rendez-vous
5. **RG5**: Un créneau horaire est unique pour un médecin donné (jour + heure de début)
6. **RG6**: Les notifications sont envoyées selon les préférences de l'utilisateur (email/SMS)
7. **RG7**: Un rendez-vous ne peut être pris que sur un créneau disponible du médecin
8. **RG8**: Les indisponibilités du médecin bloquent la prise de rendez-vous
