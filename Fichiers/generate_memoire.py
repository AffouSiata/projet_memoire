#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Générateur de Mémoire PDF - Système de Gestion des Rendez-vous Médicaux
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm, mm
from reportlab.lib.colors import HexColor, black, white, gray
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, Image, ListFlowable, ListItem, KeepTogether
)
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT
from reportlab.graphics.shapes import Drawing, Rect, String, Line, Circle
from reportlab.graphics.charts.piecharts import Pie
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics.charts.legends import Legend
from reportlab.pdfgen import canvas
from datetime import datetime
import os

# Couleurs du thème
PRIMARY_COLOR = HexColor('#0891b2')  # Cyan-600
SECONDARY_COLOR = HexColor('#0284c7')  # Sky-600
ACCENT_COLOR = HexColor('#06b6d4')  # Cyan-500
DARK_COLOR = HexColor('#1e293b')  # Slate-800
LIGHT_COLOR = HexColor('#f1f5f9')  # Slate-100
SUCCESS_COLOR = HexColor('#10b981')  # Emerald-500
WARNING_COLOR = HexColor('#f59e0b')  # Amber-500
DANGER_COLOR = HexColor('#ef4444')  # Red-500

class MemoireGenerator:
    def __init__(self, filename):
        self.filename = filename
        self.width, self.height = A4
        self.styles = getSampleStyleSheet()
        self._setup_styles()
        self.elements = []

    def _setup_styles(self):
        """Configuration des styles personnalisés"""
        # Titre principal
        self.styles.add(ParagraphStyle(
            name='MainTitle',
            parent=self.styles['Heading1'],
            fontSize=28,
            textColor=PRIMARY_COLOR,
            alignment=TA_CENTER,
            spaceAfter=30,
            spaceBefore=20,
            fontName='Helvetica-Bold'
        ))

        # Sous-titre
        self.styles.add(ParagraphStyle(
            name='SubTitle',
            parent=self.styles['Heading2'],
            fontSize=16,
            textColor=DARK_COLOR,
            alignment=TA_CENTER,
            spaceAfter=20,
            fontName='Helvetica'
        ))

        # Titre de chapitre
        self.styles.add(ParagraphStyle(
            name='ChapterTitle',
            parent=self.styles['Heading1'],
            fontSize=22,
            textColor=PRIMARY_COLOR,
            alignment=TA_LEFT,
            spaceBefore=30,
            spaceAfter=20,
            fontName='Helvetica-Bold',
            borderWidth=2,
            borderColor=PRIMARY_COLOR,
            borderPadding=10
        ))

        # Titre de section
        self.styles.add(ParagraphStyle(
            name='SectionTitle',
            parent=self.styles['Heading2'],
            fontSize=16,
            textColor=SECONDARY_COLOR,
            alignment=TA_LEFT,
            spaceBefore=20,
            spaceAfter=12,
            fontName='Helvetica-Bold'
        ))

        # Titre de sous-section
        self.styles.add(ParagraphStyle(
            name='SubSectionTitle',
            parent=self.styles['Heading3'],
            fontSize=13,
            textColor=DARK_COLOR,
            alignment=TA_LEFT,
            spaceBefore=15,
            spaceAfter=8,
            fontName='Helvetica-Bold'
        ))

        # Corps de texte
        self.styles.add(ParagraphStyle(
            name='CorpsTexte',
            parent=self.styles['Normal'],
            fontSize=11,
            textColor=DARK_COLOR,
            alignment=TA_JUSTIFY,
            spaceAfter=10,
            spaceBefore=5,
            fontName='Helvetica',
            leading=16
        ))

        # Liste
        self.styles.add(ParagraphStyle(
            name='ListItem',
            parent=self.styles['Normal'],
            fontSize=11,
            textColor=DARK_COLOR,
            alignment=TA_LEFT,
            leftIndent=20,
            spaceAfter=5,
            fontName='Helvetica'
        ))

        # Code
        self.styles.add(ParagraphStyle(
            name='CodeBlock',
            parent=self.styles['Normal'],
            fontSize=9,
            textColor=DARK_COLOR,
            alignment=TA_LEFT,
            fontName='Courier',
            backColor=LIGHT_COLOR,
            leftIndent=10,
            rightIndent=10,
            spaceBefore=10,
            spaceAfter=10
        ))

        # Légende
        self.styles.add(ParagraphStyle(
            name='Caption',
            parent=self.styles['Normal'],
            fontSize=10,
            textColor=gray,
            alignment=TA_CENTER,
            spaceAfter=15,
            spaceBefore=5,
            fontName='Helvetica-Oblique'
        ))

    def add_cover_page(self):
        """Page de couverture"""
        self.elements.append(Spacer(1, 2*cm))

        # Institution
        self.elements.append(Paragraph(
            "RÉPUBLIQUE DE CÔTE D'IVOIRE",
            ParagraphStyle('Institution', parent=self.styles['Normal'],
                          fontSize=14, alignment=TA_CENTER, fontName='Helvetica-Bold',
                          textColor=DARK_COLOR)
        ))
        self.elements.append(Paragraph(
            "Union - Discipline - Travail",
            ParagraphStyle('Motto', parent=self.styles['Normal'],
                          fontSize=11, alignment=TA_CENTER, fontName='Helvetica-Oblique',
                          textColor=gray, spaceAfter=20)
        ))

        self.elements.append(Spacer(1, 1*cm))

        # Université
        self.elements.append(Paragraph(
            "MINISTÈRE DE L'ENSEIGNEMENT SUPÉRIEUR<br/>ET DE LA RECHERCHE SCIENTIFIQUE",
            ParagraphStyle('Ministry', parent=self.styles['Normal'],
                          fontSize=12, alignment=TA_CENTER, fontName='Helvetica-Bold',
                          textColor=DARK_COLOR, spaceAfter=30)
        ))

        self.elements.append(Spacer(1, 1.5*cm))

        # Titre du mémoire
        title_style = ParagraphStyle(
            'CoverTitle',
            parent=self.styles['Normal'],
            fontSize=24,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold',
            textColor=PRIMARY_COLOR,
            spaceAfter=20,
            leading=32
        )
        self.elements.append(Paragraph(
            "MÉMOIRE DE FIN D'ÉTUDES",
            title_style
        ))

        self.elements.append(Spacer(1, 0.5*cm))

        # Sujet
        subject_style = ParagraphStyle(
            'Subject',
            parent=self.styles['Normal'],
            fontSize=18,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold',
            textColor=DARK_COLOR,
            spaceAfter=10,
            leading=26,
            borderWidth=2,
            borderColor=PRIMARY_COLOR,
            borderPadding=15
        )
        self.elements.append(Paragraph(
            "CONCEPTION ET RÉALISATION D'UNE APPLICATION WEB<br/>"
            "DE GESTION DES RENDEZ-VOUS MÉDICAUX<br/>"
            "AVEC SYSTÈME DE NOTIFICATIONS",
            subject_style
        ))

        self.elements.append(Spacer(1, 2*cm))

        # Informations
        info_data = [
            ["Présenté par :", "VOTRE NOM"],
            ["Encadré par :", "NOM DE L'ENCADRANT"],
            ["Année académique :", "2024 - 2025"],
        ]

        info_table = Table(info_data, colWidths=[6*cm, 8*cm])
        info_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 12),
            ('TEXTCOLOR', (0, 0), (0, -1), DARK_COLOR),
            ('TEXTCOLOR', (1, 0), (1, -1), PRIMARY_COLOR),
            ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
            ('ALIGN', (1, 0), (1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ]))
        self.elements.append(info_table)

        self.elements.append(PageBreak())

    def add_table_of_contents(self):
        """Table des matières"""
        self.elements.append(Paragraph("TABLE DES MATIÈRES", self.styles['MainTitle']))
        self.elements.append(Spacer(1, 1*cm))

        toc_items = [
            ("INTRODUCTION GÉNÉRALE", "4"),
            ("", ""),
            ("CHAPITRE 1 : CADRE THÉORIQUE ET MÉTHODOLOGIQUE", "6"),
            ("    1.1 Contexte et problématique", "6"),
            ("    1.2 Objectifs du projet", "8"),
            ("    1.3 Méthodologie adoptée", "9"),
            ("", ""),
            ("CHAPITRE 2 : ANALYSE ET CONCEPTION", "11"),
            ("    2.1 Analyse des besoins", "11"),
            ("    2.2 Diagrammes UML", "14"),
            ("    2.3 Modèle de données", "22"),
            ("    2.4 Architecture technique", "26"),
            ("", ""),
            ("CHAPITRE 3 : RÉALISATION ET IMPLÉMENTATION", "30"),
            ("    3.1 Technologies utilisées", "30"),
            ("    3.2 Structure du projet", "34"),
            ("    3.3 Fonctionnalités implémentées", "38"),
            ("    3.4 Sécurité et authentification", "52"),
            ("", ""),
            ("CHAPITRE 4 : PRÉSENTATION DE L'APPLICATION", "56"),
            ("    4.1 Interface d'authentification", "56"),
            ("    4.2 Espace Patient", "58"),
            ("    4.3 Espace Médecin", "68"),
            ("    4.4 Espace Administrateur", "78"),
            ("", ""),
            ("CHAPITRE 5 : TESTS ET DÉPLOIEMENT", "88"),
            ("    5.1 Stratégie de tests", "88"),
            ("    5.2 Déploiement", "92"),
            ("    5.3 Perspectives d'amélioration", "94"),
            ("", ""),
            ("CONCLUSION GÉNÉRALE", "96"),
            ("BIBLIOGRAPHIE ET WEBOGRAPHIE", "98"),
            ("ANNEXES", "100"),
        ]

        for title, page in toc_items:
            if title == "":
                self.elements.append(Spacer(1, 0.3*cm))
            else:
                is_chapter = title.startswith("CHAPITRE") or title in ["INTRODUCTION GÉNÉRALE", "CONCLUSION GÉNÉRALE", "BIBLIOGRAPHIE ET WEBOGRAPHIE", "ANNEXES"]
                style = ParagraphStyle(
                    'TOCItem',
                    parent=self.styles['Normal'],
                    fontSize=11 if is_chapter else 10,
                    fontName='Helvetica-Bold' if is_chapter else 'Helvetica',
                    textColor=PRIMARY_COLOR if is_chapter else DARK_COLOR,
                    leftIndent=0 if is_chapter else 20
                )

                toc_table = Table(
                    [[Paragraph(title, style), page]],
                    colWidths=[14*cm, 2*cm]
                )
                toc_table.setStyle(TableStyle([
                    ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
                    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                    ('FONTNAME', (1, 0), (1, 0), 'Helvetica'),
                    ('FONTSIZE', (1, 0), (1, 0), 10),
                ]))
                self.elements.append(toc_table)

        self.elements.append(PageBreak())

    def add_list_of_figures(self):
        """Liste des figures"""
        self.elements.append(Paragraph("LISTE DES FIGURES", self.styles['MainTitle']))
        self.elements.append(Spacer(1, 1*cm))

        figures = [
            ("Figure 1 : Diagramme de cas d'utilisation global", "15"),
            ("Figure 2 : Diagramme de cas d'utilisation - Patient", "16"),
            ("Figure 3 : Diagramme de cas d'utilisation - Médecin", "17"),
            ("Figure 4 : Diagramme de cas d'utilisation - Admin", "18"),
            ("Figure 5 : Diagramme de séquence - Authentification", "19"),
            ("Figure 6 : Diagramme de séquence - Prise de rendez-vous", "20"),
            ("Figure 7 : Diagramme de séquence - Gestion des notifications", "21"),
            ("Figure 8 : Diagramme de classes", "23"),
            ("Figure 9 : Modèle Conceptuel de Données (MCD)", "24"),
            ("Figure 10 : Modèle Logique de Données (MLD)", "25"),
            ("Figure 11 : Architecture technique du système", "27"),
            ("Figure 12 : Architecture Frontend React", "28"),
            ("Figure 13 : Architecture Backend NestJS", "29"),
            ("Figure 14 : Page de connexion", "56"),
            ("Figure 15 : Page d'inscription", "57"),
            ("Figure 16 : Tableau de bord Patient", "59"),
            ("Figure 17 : Prise de rendez-vous - Étape 1", "61"),
            ("Figure 18 : Prise de rendez-vous - Étape 2", "62"),
            ("Figure 19 : Historique des rendez-vous Patient", "64"),
            ("Figure 20 : Profil Patient", "66"),
            ("Figure 21 : Tableau de bord Médecin", "69"),
            ("Figure 22 : Liste des rendez-vous Médecin", "71"),
            ("Figure 23 : Gestion des patients", "73"),
            ("Figure 24 : Notes médicales", "75"),
            ("Figure 25 : Gestion des créneaux horaires", "77"),
            ("Figure 26 : Tableau de bord Administrateur", "79"),
            ("Figure 27 : Gestion des utilisateurs", "81"),
            ("Figure 28 : Statistiques avancées", "83"),
            ("Figure 29 : Journaux d'audit", "85"),
            ("Figure 30 : Paramètres système", "87"),
        ]

        for title, page in figures:
            fig_table = Table(
                [[Paragraph(title, self.styles['CorpsTexte']), page]],
                colWidths=[14*cm, 2*cm]
            )
            fig_table.setStyle(TableStyle([
                ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ]))
            self.elements.append(fig_table)

        self.elements.append(PageBreak())

    def add_list_of_tables(self):
        """Liste des tableaux"""
        self.elements.append(Paragraph("LISTE DES TABLEAUX", self.styles['MainTitle']))
        self.elements.append(Spacer(1, 1*cm))

        tables = [
            ("Tableau 1 : Comparatif des solutions existantes", "7"),
            ("Tableau 2 : Besoins fonctionnels par acteur", "12"),
            ("Tableau 3 : Besoins non fonctionnels", "13"),
            ("Tableau 4 : Description des entités du système", "24"),
            ("Tableau 5 : Technologies Frontend", "31"),
            ("Tableau 6 : Technologies Backend", "32"),
            ("Tableau 7 : Outils de développement", "33"),
            ("Tableau 8 : Structure des modules API", "35"),
            ("Tableau 9 : Endpoints API REST", "36"),
            ("Tableau 10 : Rôles et permissions", "53"),
            ("Tableau 11 : Comptes de test", "90"),
            ("Tableau 12 : Résultats des tests", "91"),
        ]

        for title, page in tables:
            tbl_table = Table(
                [[Paragraph(title, self.styles['CorpsTexte']), page]],
                colWidths=[14*cm, 2*cm]
            )
            tbl_table.setStyle(TableStyle([
                ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ]))
            self.elements.append(tbl_table)

        self.elements.append(PageBreak())

    def add_introduction(self):
        """Introduction générale"""
        self.elements.append(Paragraph("INTRODUCTION GÉNÉRALE", self.styles['ChapterTitle']))
        self.elements.append(Spacer(1, 0.5*cm))

        intro_text = """
        <b>Contexte général</b><br/><br/>

        Dans un monde où la digitalisation transforme profondément tous les secteurs d'activité, le domaine de la santé n'échappe pas à cette révolution numérique. La gestion des rendez-vous médicaux, longtemps effectuée de manière manuelle avec des carnets de rendez-vous et des appels téléphoniques, connaît aujourd'hui une transformation majeure grâce aux technologies de l'information et de la communication.<br/><br/>

        En Côte d'Ivoire, comme dans de nombreux pays en développement, les établissements de santé font face à des défis considérables : files d'attente interminables, rendez-vous manqués, difficultés de communication entre patients et praticiens, et absence de traçabilité des consultations. Ces problèmes engendrent non seulement une perte de temps précieux pour les patients et les médecins, mais aussi une baisse de la qualité des soins dispensés.<br/><br/>

        <b>Problématique</b><br/><br/>

        Face à ces constats, une question fondamentale se pose : <i>Comment concevoir un système informatique capable de faciliter la prise de rendez-vous médicaux, d'optimiser la gestion du temps des praticiens, et d'améliorer l'expérience globale des patients, tout en intégrant un système de notifications efficace ?</i><br/><br/>

        <b>Objectifs du projet</b><br/><br/>

        Ce mémoire présente la conception et la réalisation d'une application web complète de gestion des rendez-vous médicaux avec système de notifications. Les objectifs principaux sont :<br/><br/>

        • Développer une plateforme web moderne, intuitive et accessible<br/>
        • Permettre aux patients de prendre des rendez-vous en ligne facilement<br/>
        • Offrir aux médecins des outils de gestion efficaces de leur emploi du temps<br/>
        • Implémenter un système de notifications multicanal (email, SMS)<br/>
        • Assurer la sécurité et la confidentialité des données médicales<br/>
        • Fournir un tableau de bord administrateur pour la supervision globale<br/><br/>

        <b>Méthodologie</b><br/><br/>

        Pour mener à bien ce projet, nous avons adopté une approche méthodologique structurée combinant les meilleures pratiques du génie logiciel. L'analyse des besoins a été réalisée en utilisant le langage UML (Unified Modeling Language), permettant une modélisation claire et précise du système. Le développement a suivi une architecture moderne séparant le frontend (interface utilisateur) du backend (logique métier et données).<br/><br/>

        <b>Structure du document</b><br/><br/>

        Ce mémoire est organisé en cinq chapitres :<br/><br/>

        <b>Chapitre 1 : Cadre théorique et méthodologique</b> - Présente le contexte, la problématique détaillée, les objectifs et la méthodologie adoptée.<br/><br/>

        <b>Chapitre 2 : Analyse et conception</b> - Expose l'analyse des besoins, les diagrammes UML, le modèle de données et l'architecture technique retenue.<br/><br/>

        <b>Chapitre 3 : Réalisation et implémentation</b> - Détaille les technologies utilisées, la structure du projet, les fonctionnalités développées et les aspects de sécurité.<br/><br/>

        <b>Chapitre 4 : Présentation de l'application</b> - Présente les différentes interfaces de l'application avec captures d'écran et explications fonctionnelles.<br/><br/>

        <b>Chapitre 5 : Tests et déploiement</b> - Couvre la stratégie de tests, le déploiement de l'application et les perspectives d'amélioration future.
        """

        self.elements.append(Paragraph(intro_text, self.styles['CorpsTexte']))
        self.elements.append(PageBreak())

    def add_chapter1(self):
        """Chapitre 1 : Cadre théorique et méthodologique"""
        self.elements.append(Paragraph("CHAPITRE 1 : CADRE THÉORIQUE ET MÉTHODOLOGIQUE", self.styles['ChapterTitle']))

        # 1.1 Contexte et problématique
        self.elements.append(Paragraph("1.1 Contexte et problématique", self.styles['SectionTitle']))

        context_text = """
        <b>1.1.1 Contexte du projet</b><br/><br/>

        Le système de santé ivoirien connaît une croissance significative avec l'augmentation du nombre d'établissements de santé et de professionnels médicaux. Cependant, cette croissance s'accompagne de défis majeurs en termes de gestion et d'organisation. Les patients font souvent face à de longues attentes pour obtenir un rendez-vous, tandis que les médecins peinent à optimiser leur emploi du temps.<br/><br/>

        La pandémie de COVID-19 a accentué la nécessité de disposer d'outils numériques permettant de :<br/>
        • Réduire les contacts physiques inutiles<br/>
        • Faciliter la prise de rendez-vous à distance<br/>
        • Améliorer la communication entre patients et praticiens<br/>
        • Assurer un suivi médical continu<br/><br/>

        <b>1.1.2 Problématique détaillée</b><br/><br/>

        L'analyse de l'existant révèle plusieurs problèmes récurrents :<br/><br/>

        <b>Du côté des patients :</b><br/>
        • Difficulté à joindre les cabinets médicaux par téléphone<br/>
        • Temps d'attente excessif pour obtenir un rendez-vous<br/>
        • Absence de rappels automatiques entraînant des rendez-vous manqués<br/>
        • Manque de visibilité sur les disponibilités des médecins<br/>
        • Impossibilité de consulter l'historique des consultations<br/><br/>

        <b>Du côté des médecins :</b><br/>
        • Gestion manuelle et chronophage des rendez-vous<br/>
        • Taux élevé de rendez-vous non honorés (no-show)<br/>
        • Difficulté à gérer les urgences et les reprogrammations<br/>
        • Absence d'outils de suivi des patients<br/>
        • Communication limitée avec les patients entre les consultations<br/><br/>

        <b>Du côté administratif :</b><br/>
        • Absence de vue d'ensemble sur l'activité de l'établissement<br/>
        • Difficulté à générer des statistiques et rapports<br/>
        • Gestion complexe des accès et des droits utilisateurs<br/>
        """

        self.elements.append(Paragraph(context_text, self.styles['CorpsTexte']))

        # Tableau comparatif
        self.elements.append(Paragraph("Tableau 1 : Comparatif des solutions existantes", self.styles['Caption']))

        comparison_data = [
            ["Critères", "Doctolib", "Medecin Direct", "Notre Solution"],
            ["Prise de RDV en ligne", "✓", "✓", "✓"],
            ["Notifications SMS", "✓", "✗", "✓"],
            ["Notifications Email", "✓", "✓", "✓"],
            ["Espace Patient", "✓", "✓", "✓"],
            ["Espace Médecin", "✓", "✓", "✓"],
            ["Espace Admin", "✓", "Limité", "✓"],
            ["Notes médicales", "✗", "✗", "✓"],
            ["Statistiques avancées", "Payant", "✗", "✓"],
            ["Multilingue", "✓", "✗", "✓ (FR/EN)"],
            ["Open Source", "✗", "✗", "✓"],
            ["Adapté CI", "✗", "✗", "✓"],
        ]

        comp_table = Table(comparison_data, colWidths=[4*cm, 3*cm, 3*cm, 4*cm])
        comp_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_COLOR),
            ('TEXTCOLOR', (0, 0), (-1, 0), white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 0.5, DARK_COLOR),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, LIGHT_COLOR]),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
        ]))
        self.elements.append(comp_table)
        self.elements.append(Spacer(1, 0.5*cm))

        # 1.2 Objectifs
        self.elements.append(Paragraph("1.2 Objectifs du projet", self.styles['SectionTitle']))

        objectives_text = """
        <b>1.2.1 Objectif général</b><br/><br/>

        Concevoir et développer une application web complète de gestion des rendez-vous médicaux intégrant un système de notifications multicanal, permettant d'améliorer l'efficacité de la prise en charge des patients et l'organisation des praticiens.<br/><br/>

        <b>1.2.2 Objectifs spécifiques</b><br/><br/>

        <b>Pour les patients :</b><br/>
        • Offrir une interface intuitive pour la prise de rendez-vous en ligne 24h/24<br/>
        • Permettre la consultation de l'historique des rendez-vous<br/>
        • Envoyer des rappels automatiques avant chaque consultation<br/>
        • Permettre l'annulation ou le report de rendez-vous<br/><br/>

        <b>Pour les médecins :</b><br/>
        • Fournir un tableau de bord complet avec vue sur l'activité<br/>
        • Permettre la gestion des créneaux de disponibilité<br/>
        • Offrir un système de notes médicales sécurisé<br/>
        • Faciliter la communication avec les patients<br/>
        • Générer des statistiques sur l'activité<br/><br/>

        <b>Pour les administrateurs :</b><br/>
        • Centraliser la gestion des utilisateurs (patients et médecins)<br/>
        • Fournir des statistiques globales sur l'établissement<br/>
        • Permettre la configuration du système<br/>
        • Assurer la traçabilité via des journaux d'audit<br/>
        """

        self.elements.append(Paragraph(objectives_text, self.styles['CorpsTexte']))

        # 1.3 Méthodologie
        self.elements.append(Paragraph("1.3 Méthodologie adoptée", self.styles['SectionTitle']))

        methodology_text = """
        <b>1.3.1 Approche de développement</b><br/><br/>

        Pour ce projet, nous avons adopté une méthodologie agile inspirée de Scrum, adaptée à un projet individuel. Cette approche nous a permis de :<br/>
        • Travailler par itérations courtes (sprints de 2 semaines)<br/>
        • Livrer des fonctionnalités de manière incrémentale<br/>
        • S'adapter aux retours et aux nouvelles exigences<br/>
        • Maintenir une documentation à jour<br/><br/>

        <b>1.3.2 Outils de modélisation</b><br/><br/>

        L'analyse et la conception ont été réalisées avec le langage UML (Unified Modeling Language), offrant une représentation visuelle et standardisée du système. Les diagrammes suivants ont été produits :<br/>
        • Diagrammes de cas d'utilisation<br/>
        • Diagrammes de séquence<br/>
        • Diagramme de classes<br/>
        • Modèle conceptuel de données (MCD)<br/>
        • Modèle logique de données (MLD)<br/><br/>

        <b>1.3.3 Architecture logicielle</b><br/><br/>

        L'architecture retenue est une architecture moderne de type Client-Serveur avec séparation Frontend/Backend :<br/>
        • <b>Frontend</b> : Application React.js avec Tailwind CSS<br/>
        • <b>Backend</b> : API REST avec NestJS (Node.js/TypeScript)<br/>
        • <b>Base de données</b> : PostgreSQL avec Prisma ORM<br/>
        • <b>Authentification</b> : JWT (JSON Web Tokens)<br/><br/>

        Cette architecture permet une meilleure maintenabilité, scalabilité et une séparation claire des responsabilités.
        """

        self.elements.append(Paragraph(methodology_text, self.styles['CorpsTexte']))
        self.elements.append(PageBreak())

    def add_chapter2(self):
        """Chapitre 2 : Analyse et conception"""
        self.elements.append(Paragraph("CHAPITRE 2 : ANALYSE ET CONCEPTION", self.styles['ChapterTitle']))

        # 2.1 Analyse des besoins
        self.elements.append(Paragraph("2.1 Analyse des besoins", self.styles['SectionTitle']))

        needs_text = """
        <b>2.1.1 Identification des acteurs</b><br/><br/>

        Le système identifie trois acteurs principaux, chacun avec des besoins et des responsabilités spécifiques :<br/><br/>

        <b>Patient :</b> Utilisateur principal du système qui souhaite prendre des rendez-vous médicaux, consulter son historique et recevoir des notifications.<br/><br/>

        <b>Médecin :</b> Professionnel de santé qui gère ses rendez-vous, ses patients et rédige des notes médicales.<br/><br/>

        <b>Administrateur :</b> Gestionnaire du système responsable de la configuration, de la gestion des utilisateurs et de la supervision globale.<br/><br/>
        """

        self.elements.append(Paragraph(needs_text, self.styles['CorpsTexte']))

        # Tableau des besoins fonctionnels
        self.elements.append(Paragraph("Tableau 2 : Besoins fonctionnels par acteur", self.styles['Caption']))

        functional_data = [
            ["Acteur", "Besoins fonctionnels"],
            ["Patient", "• S'inscrire et se connecter\n• Prendre un rendez-vous\n• Consulter l'historique des RDV\n• Annuler/Reporter un RDV\n• Recevoir des notifications\n• Modifier son profil"],
            ["Médecin", "• Se connecter\n• Gérer son planning\n• Confirmer/Annuler des RDV\n• Consulter la liste des patients\n• Rédiger des notes médicales\n• Gérer ses créneaux disponibles"],
            ["Admin", "• Gérer les utilisateurs\n• Valider les comptes médecins\n• Consulter les statistiques\n• Configurer le système\n• Consulter les journaux d'audit\n• Gérer les notifications globales"],
        ]

        func_table = Table(functional_data, colWidths=[3*cm, 12*cm])
        func_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_COLOR),
            ('TEXTCOLOR', (0, 0), (-1, 0), white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('ALIGN', (0, 0), (0, -1), 'CENTER'),
            ('ALIGN', (1, 1), (1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('GRID', (0, 0), (-1, -1), 0.5, DARK_COLOR),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, LIGHT_COLOR]),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
            ('TOPPADDING', (0, 0), (-1, -1), 10),
        ]))
        self.elements.append(func_table)
        self.elements.append(Spacer(1, 0.5*cm))

        # Besoins non fonctionnels
        self.elements.append(Paragraph("Tableau 3 : Besoins non fonctionnels", self.styles['Caption']))

        non_func_data = [
            ["Catégorie", "Exigence", "Description"],
            ["Performance", "Temps de réponse", "< 2 secondes pour chaque requête"],
            ["Performance", "Disponibilité", "99% de disponibilité"],
            ["Sécurité", "Authentification", "JWT avec tokens de rafraîchissement"],
            ["Sécurité", "Mots de passe", "Hashage bcrypt avec salt"],
            ["Sécurité", "Données sensibles", "Chiffrement des données médicales"],
            ["Ergonomie", "Responsive", "Adapté mobile, tablette et desktop"],
            ["Ergonomie", "Accessibilité", "Conformité WCAG 2.1"],
            ["Ergonomie", "Multilingue", "Français et Anglais"],
            ["Fiabilité", "Sauvegarde", "Backup automatique quotidien"],
            ["Fiabilité", "Logs", "Journalisation des actions critiques"],
        ]

        non_func_table = Table(non_func_data, colWidths=[3*cm, 4*cm, 8*cm])
        non_func_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), SECONDARY_COLOR),
            ('TEXTCOLOR', (0, 0), (-1, 0), white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 0.5, DARK_COLOR),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, LIGHT_COLOR]),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
        ]))
        self.elements.append(non_func_table)

        # 2.2 Diagrammes UML
        self.elements.append(Paragraph("2.2 Diagrammes UML", self.styles['SectionTitle']))

        uml_intro = """
        <b>2.2.1 Diagramme de cas d'utilisation global</b><br/><br/>

        Le diagramme de cas d'utilisation ci-dessous présente une vue d'ensemble des fonctionnalités du système et des interactions entre les différents acteurs.<br/><br/>
        """
        self.elements.append(Paragraph(uml_intro, self.styles['CorpsTexte']))

        # Représentation textuelle du diagramme de cas d'utilisation
        self.elements.append(Paragraph("Figure 1 : Diagramme de cas d'utilisation global", self.styles['Caption']))

        use_case_box = """
        ┌─────────────────────────────────────────────────────────────────────────┐
        │                    SYSTÈME DE GESTION DES RENDEZ-VOUS                    │
        │                                                                          │
        │   ┌──────────────┐                                    ┌──────────────┐  │
        │   │              │                                    │              │  │
        │   │   PATIENT    │──── S'authentifier ────────────────│   MÉDECIN    │  │
        │   │              │                                    │              │  │
        │   └──────┬───────┘                                    └──────┬───────┘  │
        │          │                                                   │          │
        │          ├── Prendre RDV                    Gérer planning ──┤          │
        │          ├── Consulter historique         Confirmer/Annuler ──┤          │
        │          ├── Annuler RDV                   Gérer patients ──┤          │
        │          ├── Modifier profil              Rédiger notes ──┤          │
        │          └── Recevoir notifications    Gérer créneaux ──┘          │
        │                                                                          │
        │                           ┌──────────────┐                              │
        │                           │              │                              │
        │                           │    ADMIN     │                              │
        │                           │              │                              │
        │                           └──────┬───────┘                              │
        │                                  │                                       │
        │                                  ├── Gérer utilisateurs                  │
        │                                  ├── Valider médecins                    │
        │                                  ├── Consulter statistiques              │
        │                                  ├── Configurer système                  │
        │                                  └── Consulter audit logs                │
        └─────────────────────────────────────────────────────────────────────────┘
        """

        self.elements.append(Paragraph(f"<font face='Courier' size='8'><pre>{use_case_box}</pre></font>", self.styles['CodeBlock']))

        # Diagramme de séquence
        self.elements.append(Paragraph("<b>2.2.2 Diagrammes de séquence</b>", self.styles['SubSectionTitle']))

        seq_text = """
        Les diagrammes de séquence illustrent les interactions entre les acteurs et le système pour les processus clés.<br/><br/>

        <b>Processus d'authentification :</b><br/>
        1. L'utilisateur saisit ses identifiants (email/mot de passe)<br/>
        2. Le frontend envoie une requête POST à /api/auth/login<br/>
        3. Le backend vérifie les identifiants dans la base de données<br/>
        4. Si valides, génération d'un accessToken (15 min) et refreshToken (7 jours)<br/>
        5. Retour des tokens et des informations utilisateur au frontend<br/>
        6. Stockage des tokens dans le localStorage<br/>
        7. Redirection vers le tableau de bord approprié selon le rôle<br/><br/>

        <b>Processus de prise de rendez-vous :</b><br/>
        1. Le patient sélectionne une spécialité médicale<br/>
        2. Le système affiche les médecins disponibles<br/>
        3. Le patient choisit un médecin<br/>
        4. Le système affiche les créneaux disponibles<br/>
        5. Le patient sélectionne une date et un créneau horaire<br/>
        6. Le patient saisit le motif de la consultation<br/>
        7. Confirmation et création du rendez-vous (statut: EN_ATTENTE)<br/>
        8. Envoi de notifications (email/SMS) au patient et au médecin<br/>
        """

        self.elements.append(Paragraph(seq_text, self.styles['CorpsTexte']))

        # 2.3 Modèle de données
        self.elements.append(Paragraph("2.3 Modèle de données", self.styles['SectionTitle']))

        data_model_text = """
        <b>2.3.1 Description des entités</b><br/><br/>

        Le système repose sur plusieurs entités interconnectées, chacune représentant un concept métier fondamental.<br/><br/>
        """

        self.elements.append(Paragraph(data_model_text, self.styles['CorpsTexte']))

        # Tableau des entités
        self.elements.append(Paragraph("Tableau 4 : Description des entités du système", self.styles['Caption']))

        entities_data = [
            ["Entité", "Description", "Attributs principaux"],
            ["User", "Utilisateur du système (Patient, Médecin ou Admin)", "id, nom, prenom, email, motDePasse, role, telephone"],
            ["RendezVous", "Rendez-vous médical entre patient et médecin", "id, patientId, medecinId, date, statut, motif"],
            ["TimeSlot", "Créneau de disponibilité d'un médecin", "id, medecinId, jour, heureDebut, heureFin, isAvailable"],
            ["NoteMedicale", "Note/observation médicale sur un patient", "id, medecinId, patientId, contenu, statut, piecesJointes"],
            ["Notification", "Notification envoyée à un utilisateur", "id, userId, type, titre, description, lue"],
            ["AuditLog", "Journal d'audit des actions", "id, userId, action, entity, status, ip"],
        ]

        entities_table = Table(entities_data, colWidths=[3*cm, 5*cm, 7*cm])
        entities_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_COLOR),
            ('TEXTCOLOR', (0, 0), (-1, 0), white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('GRID', (0, 0), (-1, -1), 0.5, DARK_COLOR),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, LIGHT_COLOR]),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
        ]))
        self.elements.append(entities_table)
        self.elements.append(Spacer(1, 0.5*cm))

        # Schéma de la base de données (représentation textuelle)
        self.elements.append(Paragraph("<b>2.3.2 Schéma relationnel de la base de données</b>", self.styles['SubSectionTitle']))

        schema_text = """
        <b>User</b> (id, nom, prenom, email, motDePasse, role, telephone, dateNaissance, adresse, isActive, specialite*, numeroOrdre*, statutValidation*, preferencesNotifEmail, preferencesNotifSms, theme, langue)<br/><br/>

        <b>RendezVous</b> (id, #patientId, #medecinId, date, statut, motif, createdAt, updatedAt)<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;patientId référence User(id)<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;medecinId référence User(id)<br/><br/>

        <b>TimeSlot</b> (id, #medecinId, jour, heureDebut, heureFin, isAvailable)<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;medecinId référence User(id)<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;Contrainte UNIQUE(medecinId, jour, heureDebut)<br/><br/>

        <b>NoteMedicale</b> (id, #medecinId, #patientId, contenu, statut, piecesJointes[], createdAt)<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;medecinId référence User(id)<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;patientId référence User(id)<br/><br/>

        <b>Notification</b> (id, #userId, type, titre, description, lue, createdAt)<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;userId référence User(id)<br/><br/>

        <b>AuditLog</b> (id, #userId, userName, userRole, action, entity, entityId, ip, userAgent, status, metadata, createdAt)<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;userId référence User(id) - nullable<br/>
        """

        self.elements.append(Paragraph(schema_text, self.styles['CorpsTexte']))

        # 2.4 Architecture technique
        self.elements.append(Paragraph("2.4 Architecture technique", self.styles['SectionTitle']))

        archi_text = """
        <b>2.4.1 Architecture globale</b><br/><br/>

        L'application suit une architecture moderne de type Client-Serveur avec une API RESTful. Cette architecture offre plusieurs avantages :<br/><br/>

        • <b>Séparation des préoccupations</b> : Le frontend et le backend sont développés et déployés indépendamment<br/>
        • <b>Scalabilité</b> : Chaque composant peut être mis à l'échelle séparément<br/>
        • <b>Réutilisabilité</b> : L'API peut être consommée par d'autres clients (mobile, etc.)<br/>
        • <b>Maintenabilité</b> : Les modifications sur un composant n'impactent pas les autres<br/><br/>

        <b>2.4.2 Architecture Frontend</b><br/><br/>

        Le frontend est construit avec React.js et suit une architecture par composants :<br/><br/>

        • <b>Pages</b> : Composants de haut niveau correspondant aux routes<br/>
        • <b>Components</b> : Composants réutilisables (Layout, Modals, Forms)<br/>
        • <b>Context</b> : Gestion de l'état global (Auth, Theme, Notifications)<br/>
        • <b>Services</b> : Couche d'abstraction pour les appels API<br/>
        • <b>Utils</b> : Fonctions utilitaires (validation, formatage)<br/>
        • <b>Hooks</b> : Hooks personnalisés pour la logique réutilisable<br/><br/>

        <b>2.4.3 Architecture Backend</b><br/><br/>

        Le backend est construit avec NestJS et suit une architecture modulaire :<br/><br/>

        • <b>Modules</b> : Regroupement logique des fonctionnalités (auth, patients, medecins, admin)<br/>
        • <b>Controllers</b> : Gestion des requêtes HTTP et des routes<br/>
        • <b>Services</b> : Logique métier et accès aux données<br/>
        • <b>DTOs</b> : Validation et typage des données entrantes<br/>
        • <b>Guards</b> : Protection des routes (authentification, autorisation)<br/>
        • <b>Decorators</b> : Annotations personnalisées (@CurrentUser, @Roles)<br/>
        """

        self.elements.append(Paragraph(archi_text, self.styles['CorpsTexte']))
        self.elements.append(PageBreak())

    def add_chapter3(self):
        """Chapitre 3 : Réalisation et implémentation"""
        self.elements.append(Paragraph("CHAPITRE 3 : RÉALISATION ET IMPLÉMENTATION", self.styles['ChapterTitle']))

        # 3.1 Technologies utilisées
        self.elements.append(Paragraph("3.1 Technologies utilisées", self.styles['SectionTitle']))

        tech_intro = """
        Le choix des technologies a été guidé par plusieurs critères : modernité, performance, maintenabilité, et adéquation avec les besoins du projet.<br/><br/>
        """
        self.elements.append(Paragraph(tech_intro, self.styles['CorpsTexte']))

        # Tableau Technologies Frontend
        self.elements.append(Paragraph("Tableau 5 : Technologies Frontend", self.styles['Caption']))

        frontend_tech = [
            ["Technologie", "Version", "Rôle"],
            ["React", "19.x", "Bibliothèque UI pour construire l'interface"],
            ["React Router", "7.x", "Gestion du routage côté client"],
            ["Tailwind CSS", "3.x", "Framework CSS utilitaire pour le styling"],
            ["Headless UI", "2.x", "Composants UI accessibles (modals, menus)"],
            ["Heroicons", "2.x", "Bibliothèque d'icônes SVG"],
            ["i18next", "23.x", "Internationalisation (FR/EN)"],
            ["Axios", "1.x", "Client HTTP pour les appels API"],
            ["Recharts", "2.x", "Graphiques et visualisation de données"],
            ["date-fns", "3.x", "Manipulation des dates"],
        ]

        fe_table = Table(frontend_tech, colWidths=[4*cm, 2.5*cm, 8.5*cm])
        fe_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_COLOR),
            ('TEXTCOLOR', (0, 0), (-1, 0), white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 0.5, DARK_COLOR),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, LIGHT_COLOR]),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
        ]))
        self.elements.append(fe_table)
        self.elements.append(Spacer(1, 0.5*cm))

        # Tableau Technologies Backend
        self.elements.append(Paragraph("Tableau 6 : Technologies Backend", self.styles['Caption']))

        backend_tech = [
            ["Technologie", "Version", "Rôle"],
            ["Node.js", "20.x LTS", "Environnement d'exécution JavaScript"],
            ["NestJS", "10.x", "Framework backend modulaire et scalable"],
            ["TypeScript", "5.x", "Superset JavaScript avec typage statique"],
            ["Prisma", "5.22", "ORM moderne pour PostgreSQL"],
            ["PostgreSQL", "15.x", "Base de données relationnelle"],
            ["JWT", "-", "Authentification par tokens"],
            ["bcrypt", "5.x", "Hashage sécurisé des mots de passe"],
            ["Nodemailer", "6.x", "Envoi d'emails (notifications)"],
            ["Twilio", "5.x", "Envoi de SMS (notifications)"],
            ["class-validator", "0.14", "Validation des DTOs"],
        ]

        be_table = Table(backend_tech, colWidths=[4*cm, 2.5*cm, 8.5*cm])
        be_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), SECONDARY_COLOR),
            ('TEXTCOLOR', (0, 0), (-1, 0), white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 0.5, DARK_COLOR),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, LIGHT_COLOR]),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
        ]))
        self.elements.append(be_table)
        self.elements.append(Spacer(1, 0.5*cm))

        # Tableau Outils
        self.elements.append(Paragraph("Tableau 7 : Outils de développement", self.styles['Caption']))

        tools_data = [
            ["Outil", "Usage"],
            ["Visual Studio Code", "Éditeur de code principal"],
            ["Git / GitHub", "Gestion de versions et collaboration"],
            ["Postman", "Test des endpoints API"],
            ["Prisma Studio", "Interface graphique pour la base de données"],
            ["Docker", "Conteneurisation pour le déploiement"],
            ["Render", "Plateforme de déploiement cloud"],
            ["Figma", "Conception des maquettes UI/UX"],
        ]

        tools_table = Table(tools_data, colWidths=[5*cm, 10*cm])
        tools_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), ACCENT_COLOR),
            ('TEXTCOLOR', (0, 0), (-1, 0), white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 0.5, DARK_COLOR),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, LIGHT_COLOR]),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
        ]))
        self.elements.append(tools_table)

        # 3.2 Structure du projet
        self.elements.append(Paragraph("3.2 Structure du projet", self.styles['SectionTitle']))

        structure_text = """
        <b>3.2.1 Organisation du code source</b><br/><br/>

        Le projet est organisé en monorepo avec deux applications principales :<br/><br/>
        """
        self.elements.append(Paragraph(structure_text, self.styles['CorpsTexte']))

        # Structure arborescente
        tree_structure = """
        projet_memoire/
        ├── medical-appointment-api/          # Backend NestJS
        │   ├── prisma/
        │   │   ├── schema.prisma             # Schéma de la base de données
        │   │   └── seed.ts                   # Données de test
        │   ├── src/
        │   │   ├── auth/                     # Module authentification
        │   │   ├── patients/                 # Module patient
        │   │   ├── medecins/                 # Module médecin
        │   │   ├── admin/                    # Module administration
        │   │   ├── notifications/            # Module notifications
        │   │   ├── timeslots/                # Module créneaux horaires
        │   │   ├── common/                   # Guards, decorators, filters
        │   │   ├── prisma/                   # Service Prisma
        │   │   └── main.ts                   # Point d'entrée
        │   └── package.json
        │
        ├── medical-appointment-frontend/     # Frontend React
        │   ├── src/
        │   │   ├── components/               # Composants réutilisables
        │   │   │   ├── layout/               # Layouts par rôle
        │   │   │   ├── modals/               # Modales
        │   │   │   └── common/               # Composants communs
        │   │   ├── pages/                    # Pages par rôle
        │   │   │   ├── auth/                 # Login, Register
        │   │   │   ├── patient/              # Pages patient
        │   │   │   ├── medecin/              # Pages médecin
        │   │   │   └── admin/                # Pages admin
        │   │   ├── context/                  # Contexts React
        │   │   ├── services/                 # Services API
        │   │   ├── utils/                    # Utilitaires
        │   │   ├── locales/                  # Traductions i18n
        │   │   └── App.jsx                   # Composant racine
        │   └── package.json
        │
        └── CLAUDE.md                         # Documentation technique
        """

        self.elements.append(Paragraph(f"<font face='Courier' size='8'><pre>{tree_structure}</pre></font>", self.styles['CodeBlock']))

        # Tableau des modules API
        self.elements.append(Paragraph("Tableau 8 : Structure des modules API", self.styles['Caption']))

        modules_data = [
            ["Module", "Controller", "Service", "Description"],
            ["auth", "auth.controller.ts", "auth.service.ts", "Inscription, connexion, refresh token"],
            ["patients", "patients.controller.ts", "patients.service.ts", "Gestion profil, RDV, notifications patient"],
            ["medecins", "medecins.controller.ts", "medecins.service.ts", "Gestion RDV, patients, notes, créneaux"],
            ["admin", "admin.controller.ts", "admin.service.ts", "Gestion utilisateurs, stats, audit"],
            ["notifications", "notifications.controller.ts", "notifications.service.ts", "Email, SMS, notifications in-app"],
            ["timeslots", "timeslots.controller.ts", "timeslots.service.ts", "Créneaux publics des médecins"],
        ]

        modules_table = Table(modules_data, colWidths=[2.5*cm, 4*cm, 4*cm, 4.5*cm])
        modules_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_COLOR),
            ('TEXTCOLOR', (0, 0), (-1, 0), white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 8),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 0.5, DARK_COLOR),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, LIGHT_COLOR]),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
        ]))
        self.elements.append(modules_table)
        self.elements.append(Spacer(1, 0.5*cm))

        # Tableau des endpoints
        self.elements.append(Paragraph("Tableau 9 : Endpoints API REST", self.styles['Caption']))

        endpoints_data = [
            ["Méthode", "Endpoint", "Description", "Rôle requis"],
            ["POST", "/api/auth/register", "Inscription utilisateur", "Public"],
            ["POST", "/api/auth/login", "Connexion", "Public"],
            ["POST", "/api/auth/refresh", "Rafraîchir le token", "Authentifié"],
            ["GET", "/api/patients/profile", "Profil patient", "PATIENT"],
            ["POST", "/api/patients/rendezvous", "Créer un rendez-vous", "PATIENT"],
            ["GET", "/api/patients/rendezvous", "Liste des RDV patient", "PATIENT"],
            ["GET", "/api/medecins/rendezvous", "Liste des RDV médecin", "MEDECIN"],
            ["PATCH", "/api/medecins/rendezvous/:id", "Modifier statut RDV", "MEDECIN"],
            ["GET", "/api/medecins/patients", "Liste des patients", "MEDECIN"],
            ["POST", "/api/medecins/notes", "Créer une note médicale", "MEDECIN"],
            ["GET", "/api/admin/users", "Liste des utilisateurs", "ADMIN"],
            ["PATCH", "/api/admin/medecins/:id/validate", "Valider un médecin", "ADMIN"],
            ["GET", "/api/admin/statistics", "Statistiques globales", "ADMIN"],
            ["GET", "/api/timeslots/medecin/:id", "Créneaux d'un médecin", "Public"],
        ]

        endpoints_table = Table(endpoints_data, colWidths=[2*cm, 5*cm, 5*cm, 3*cm])
        endpoints_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), SECONDARY_COLOR),
            ('TEXTCOLOR', (0, 0), (-1, 0), white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 8),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 0.5, DARK_COLOR),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, LIGHT_COLOR]),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
        ]))
        self.elements.append(endpoints_table)

        # 3.3 Fonctionnalités implémentées
        self.elements.append(Paragraph("3.3 Fonctionnalités implémentées", self.styles['SectionTitle']))

        features_text = """
        <b>3.3.1 Système d'authentification</b><br/><br/>

        L'authentification utilise JWT (JSON Web Tokens) avec une stratégie de double token :<br/>
        • <b>Access Token</b> : Durée de vie courte (15 minutes), utilisé pour les requêtes API<br/>
        • <b>Refresh Token</b> : Durée de vie longue (7 jours), permet de renouveler l'access token<br/><br/>

        <b>Processus d'authentification :</b><br/>
        1. L'utilisateur s'inscrit ou se connecte<br/>
        2. Le serveur génère et retourne les deux tokens<br/>
        3. Le frontend stocke les tokens dans localStorage<br/>
        4. Chaque requête API inclut l'access token dans le header Authorization<br/>
        5. Quand l'access token expire, le frontend utilise le refresh token pour en obtenir un nouveau<br/><br/>

        <b>3.3.2 Gestion des rendez-vous</b><br/><br/>

        Le système de rendez-vous est le cœur de l'application :<br/><br/>

        <b>Cycle de vie d'un rendez-vous :</b><br/>
        1. <b>Création</b> : Le patient crée un RDV → Statut: EN_ATTENTE<br/>
        2. <b>Confirmation</b> : Le médecin confirme → Statut: CONFIRME<br/>
        3. <b>Annulation</b> : Patient ou médecin annule → Statut: ANNULE<br/><br/>

        <b>Règles métier importantes :</b><br/>
        • Un patient ne peut PAS confirmer son propre rendez-vous (seul le médecin peut)<br/>
        • Un patient peut uniquement annuler ses rendez-vous<br/>
        • Les créneaux déjà réservés ne sont plus disponibles<br/>
        • Les notifications sont envoyées automatiquement à chaque changement de statut<br/><br/>

        <b>3.3.3 Système de notifications</b><br/><br/>

        Le système de notifications est multicanal :<br/><br/>

        <b>Types de notifications :</b><br/>
        • RAPPEL : Rappel de rendez-vous à venir<br/>
        • CONFIRMATION : Confirmation de rendez-vous<br/>
        • ANNULATION : Annulation de rendez-vous<br/>
        • CHANGEMENT_HORAIRE : Modification d'horaire<br/>
        • RECOMMANDATION : Recommandation médicale<br/><br/>

        <b>Canaux de diffusion :</b><br/>
        • Email via Nodemailer (SMTP)<br/>
        • SMS via Twilio<br/>
        • Notifications in-app (base de données)<br/><br/>

        <b>3.3.4 Gestion des créneaux horaires</b><br/><br/>

        Les médecins peuvent définir leurs disponibilités :<br/>
        • Configuration par jour de la semaine<br/>
        • Définition d'heures de début et de fin<br/>
        • Possibilité de désactiver temporairement un créneau<br/>
        • Les créneaux sont publics pour permettre aux patients de voir les disponibilités<br/><br/>

        <b>3.3.5 Notes médicales</b><br/><br/>

        Les médecins peuvent documenter les consultations :<br/>
        • Création de notes associées à un patient<br/>
        • Statut: ACTIF ou ARCHIVE<br/>
        • Possibilité d'attacher des pièces jointes (PDF, images)<br/>
        • Recherche et filtrage des notes<br/>
        """

        self.elements.append(Paragraph(features_text, self.styles['CorpsTexte']))

        # 3.4 Sécurité
        self.elements.append(Paragraph("3.4 Sécurité et authentification", self.styles['SectionTitle']))

        security_text = """
        <b>3.4.1 Mesures de sécurité implémentées</b><br/><br/>

        La sécurité est un aspect critique d'une application médicale. Plusieurs mesures ont été mises en place :<br/><br/>

        <b>Authentification et autorisation :</b><br/>
        • Mots de passe hashés avec bcrypt (salt rounds: 10)<br/>
        • Tokens JWT signés avec une clé secrète<br/>
        • Guards NestJS pour protéger les routes<br/>
        • Décorateur @Roles() pour le contrôle d'accès basé sur les rôles<br/><br/>

        <b>Validation des données :</b><br/>
        • Validation des DTOs avec class-validator<br/>
        • Sanitization des entrées utilisateur<br/>
        • Validation côté frontend avant soumission<br/><br/>

        <b>Protection des endpoints :</b><br/>
        • CORS configuré pour n'accepter que les origines autorisées<br/>
        • Rate limiting pour prévenir les attaques par force brute<br/>
        • Journalisation des actions sensibles (audit logs)<br/><br/>
        """

        self.elements.append(Paragraph(security_text, self.styles['CorpsTexte']))

        # Tableau des rôles
        self.elements.append(Paragraph("Tableau 10 : Rôles et permissions", self.styles['Caption']))

        roles_data = [
            ["Permission", "PATIENT", "MEDECIN", "ADMIN"],
            ["Consulter son profil", "✓", "✓", "✓"],
            ["Modifier son profil", "✓", "✓", "✓"],
            ["Prendre un rendez-vous", "✓", "✗", "✗"],
            ["Annuler un rendez-vous", "✓", "✓", "✓"],
            ["Confirmer un rendez-vous", "✗", "✓", "✓"],
            ["Gérer les créneaux", "✗", "✓", "✗"],
            ["Créer des notes médicales", "✗", "✓", "✗"],
            ["Voir liste des patients", "✗", "✓", "✓"],
            ["Gérer les utilisateurs", "✗", "✗", "✓"],
            ["Valider les médecins", "✗", "✗", "✓"],
            ["Voir les statistiques globales", "✗", "✗", "✓"],
            ["Consulter les audit logs", "✗", "✗", "✓"],
        ]

        roles_table = Table(roles_data, colWidths=[6*cm, 2.5*cm, 2.5*cm, 2.5*cm])
        roles_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_COLOR),
            ('TEXTCOLOR', (0, 0), (-1, 0), white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 0.5, DARK_COLOR),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, LIGHT_COLOR]),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
        ]))
        self.elements.append(roles_table)
        self.elements.append(PageBreak())

    def add_chapter4(self):
        """Chapitre 4 : Présentation de l'application"""
        self.elements.append(Paragraph("CHAPITRE 4 : PRÉSENTATION DE L'APPLICATION", self.styles['ChapterTitle']))

        intro_ch4 = """
        Ce chapitre présente les différentes interfaces de l'application, organisées par espace utilisateur. Chaque interface est décrite avec ses fonctionnalités et son ergonomie.<br/><br/>

        <i>Note : Les captures d'écran mentionnées dans ce chapitre doivent être ajoutées lors de la finalisation du document.</i><br/><br/>
        """
        self.elements.append(Paragraph(intro_ch4, self.styles['CorpsTexte']))

        # 4.1 Interface d'authentification
        self.elements.append(Paragraph("4.1 Interface d'authentification", self.styles['SectionTitle']))

        auth_text = """
        <b>4.1.1 Page de connexion</b><br/><br/>

        La page de connexion est la porte d'entrée de l'application. Elle présente un design moderne et épuré avec :<br/><br/>

        • Un formulaire centré avec champs email et mot de passe<br/>
        • Validation en temps réel des champs<br/>
        • Messages d'erreur explicites<br/>
        • Lien vers la page d'inscription<br/>
        • Fond avec effet de gradient animé<br/>
        • Mode sombre/clair supporté<br/><br/>

        <b>[Figure 14 : Page de connexion - Insérer capture d'écran ici]</b><br/><br/>

        <b>4.1.2 Page d'inscription</b><br/><br/>

        L'inscription se fait en deux étapes :<br/><br/>

        <b>Étape 1 : Choix du type de compte</b><br/>
        • Patient : accès aux fonctionnalités de prise de rendez-vous<br/>
        • Médecin : accès aux outils de gestion médicale<br/><br/>

        <b>Étape 2 : Formulaire d'inscription</b><br/>
        • Informations communes : nom, prénom, email, téléphone, mot de passe<br/>
        • Champs spécifiques médecin : spécialité, numéro d'ordre<br/>
        • Validation complète avec messages d'erreur<br/><br/>

        <b>[Figure 15 : Page d'inscription - Insérer capture d'écran ici]</b><br/><br/>

        <b>Particularité pour les médecins :</b><br/>
        Après inscription, le compte médecin est en statut "PENDING" et doit être validé par un administrateur avant de pouvoir être utilisé. Cette mesure garantit que seuls les professionnels de santé légitimes peuvent accéder à l'espace médecin.
        """

        self.elements.append(Paragraph(auth_text, self.styles['CorpsTexte']))

        # 4.2 Espace Patient
        self.elements.append(Paragraph("4.2 Espace Patient", self.styles['SectionTitle']))

        patient_text = """
        L'espace patient est conçu pour offrir une expérience utilisateur fluide et intuitive. Il comprend les sections suivantes :<br/><br/>

        <b>4.2.1 Tableau de bord Patient</b><br/><br/>

        Le tableau de bord offre une vue synthétique de l'activité du patient :<br/><br/>

        <b>En-tête personnalisée :</b><br/>
        • Message de bienvenue avec le nom du patient<br/>
        • Date et heure actuelles<br/>
        • Accès rapide aux notifications et au profil<br/><br/>

        <b>Cartes statistiques :</b><br/>
        • Prochain rendez-vous avec compte à rebours<br/>
        • Nombre de rendez-vous à venir<br/>
        • Rendez-vous passés ce mois<br/>
        • Rendez-vous annulés<br/><br/>

        <b>Mini-calendrier :</b><br/>
        • Vue mensuelle avec code couleur par statut<br/>
        • Bleu = Confirmé, Orange = En attente, Rouge = Annulé<br/><br/>

        <b>Graphiques statistiques :</b><br/>
        • Évolution des consultations par mois<br/>
        • Répartition par spécialité consultée<br/><br/>

        <b>[Figure 16 : Tableau de bord Patient - Insérer capture d'écran ici]</b><br/><br/>

        <b>4.2.2 Prise de rendez-vous</b><br/><br/>

        Le processus de prise de rendez-vous est guidé en 4 étapes :<br/><br/>

        <b>Étape 1 : Sélection de la spécialité</b><br/>
        • Liste des spécialités disponibles avec icônes<br/>
        • Suggestions basées sur l'historique du patient<br/><br/>

        <b>[Figure 17 : Prise de rendez-vous - Étape 1 - Insérer capture d'écran ici]</b><br/><br/>

        <b>Étape 2 : Choix du médecin</b><br/>
        • Cartes de présentation des médecins disponibles<br/>
        • Informations : nom, spécialité, photo<br/>
        • Filtre par disponibilité<br/><br/>

        <b>Étape 3 : Sélection de la date et du créneau</b><br/>
        • Calendrier interactif avec dates disponibles<br/>
        • Grille des créneaux horaires<br/>
        • Code couleur : Vert = disponible, Gris = indisponible<br/><br/>

        <b>[Figure 18 : Prise de rendez-vous - Étape 2 et 3 - Insérer capture d'écran ici]</b><br/><br/>

        <b>Étape 4 : Motif et confirmation</b><br/>
        • Champ pour le motif de consultation<br/>
        • Récapitulatif complet du rendez-vous<br/>
        • Bouton de confirmation<br/>
        • Notifications automatiques après confirmation<br/><br/>

        <b>4.2.3 Historique des rendez-vous</b><br/><br/>

        Cette page permet de consulter tous les rendez-vous passés et à venir :<br/><br/>

        <b>Fonctionnalités :</b><br/>
        • Liste chronologique des rendez-vous<br/>
        • Filtres par statut, médecin, période<br/>
        • Barre de recherche<br/>
        • Actions : annuler (si à venir)<br/>
        • Détails complets en clic sur un rendez-vous<br/><br/>

        <b>Informations affichées :</b><br/>
        • Date et heure<br/>
        • Médecin et spécialité<br/>
        • Statut avec badge coloré<br/>
        • Motif de la consultation<br/><br/>

        <b>[Figure 19 : Historique des rendez-vous Patient - Insérer capture d'écran ici]</b><br/><br/>

        <b>4.2.4 Notifications</b><br/><br/>

        Centre de notifications du patient :<br/>
        • Liste des notifications reçues<br/>
        • Icônes par type (rappel, confirmation, annulation)<br/>
        • Marquage lu/non lu<br/>
        • Filtres par type<br/>
        • Actions : marquer comme lu, supprimer<br/><br/>

        <b>4.2.5 Profil et Paramètres</b><br/><br/>

        <b>[Figure 20 : Profil Patient - Insérer capture d'écran ici]</b><br/><br/>

        <b>Page Profil :</b><br/>
        • Visualisation des informations personnelles<br/>
        • Photo de profil (initiales par défaut)<br/>
        • Formulaire de modification<br/>
        • Changement de mot de passe<br/><br/>

        <b>Page Paramètres :</b><br/>
        • Préférences de notifications (email, SMS)<br/>
        • Thème (clair/sombre)<br/>
        • Langue (Français/Anglais)<br/>
        """

        self.elements.append(Paragraph(patient_text, self.styles['CorpsTexte']))

        # 4.3 Espace Médecin
        self.elements.append(Paragraph("4.3 Espace Médecin", self.styles['SectionTitle']))

        medecin_text = """
        L'espace médecin offre des outils professionnels pour la gestion de l'activité médicale.<br/><br/>

        <b>4.3.1 Tableau de bord Médecin</b><br/><br/>

        <b>[Figure 21 : Tableau de bord Médecin - Insérer capture d'écran ici]</b><br/><br/>

        <b>Éléments du tableau de bord :</b><br/>
        • Message de bienvenue personnalisé "Bonjour Dr [Nom]"<br/>
        • Rendez-vous du jour avec liste des patients<br/>
        • Statistiques : RDV confirmés, en attente, annulés<br/>
        • Mini-calendrier du mois<br/>
        • Graphiques d'activité<br/>
        • Alertes et recommandations<br/><br/>

        <b>4.3.2 Gestion des rendez-vous</b><br/><br/>

        <b>[Figure 22 : Liste des rendez-vous Médecin - Insérer capture d'écran ici]</b><br/><br/>

        <b>Fonctionnalités :</b><br/>
        • Liste complète des rendez-vous<br/>
        • Filtres multiples (statut, date, patient)<br/>
        • Actions : confirmer, annuler, voir détails<br/>
        • Vue calendrier optionnelle<br/>
        • Export des données<br/><br/>

        <b>Workflow de confirmation :</b><br/>
        1. RDV créé par patient → Statut: EN_ATTENTE<br/>
        2. Médecin clique "Confirmer" → Statut: CONFIRME<br/>
        3. Notification automatique envoyée au patient<br/><br/>

        <b>4.3.3 Gestion des patients</b><br/><br/>

        <b>[Figure 23 : Gestion des patients - Insérer capture d'écran ici]</b><br/><br/>

        <b>Liste des patients :</b><br/>
        • Tous les patients ayant eu un RDV avec ce médecin<br/>
        • Recherche par nom<br/>
        • Informations : nom, téléphone, dernier RDV<br/>
        • Accès au dossier patient<br/><br/>

        <b>Fiche patient :</b><br/>
        • Informations de contact<br/>
        • Historique des rendez-vous<br/>
        • Notes médicales associées<br/><br/>

        <b>4.3.4 Notes médicales</b><br/><br/>

        <b>[Figure 24 : Notes médicales - Insérer capture d'écran ici]</b><br/><br/>

        <b>Fonctionnalités :</b><br/>
        • Création de notes pour chaque patient<br/>
        • Éditeur de texte riche<br/>
        • Statut : ACTIF ou ARCHIVE<br/>
        • Pièces jointes (PDF, images)<br/>
        • Recherche et filtrage<br/>
        • Historique complet<br/><br/>

        <b>4.3.5 Gestion des créneaux</b><br/><br/>

        <b>[Figure 25 : Gestion des créneaux horaires - Insérer capture d'écran ici]</b><br/><br/>

        <b>Configuration des disponibilités :</b><br/>
        • Par jour de la semaine<br/>
        • Heures de début et de fin<br/>
        • Activation/désactivation des créneaux<br/>
        • Création de créneaux multiples<br/>
        • Suppression des créneaux<br/><br/>

        <b>Règles de validation :</b><br/>
        • Heure de fin > Heure de début<br/>
        • Durée minimum : 30 minutes<br/>
        • Horaires entre 6h et 22h<br/>
        • Pas de chevauchement<br/>
        """

        self.elements.append(Paragraph(medecin_text, self.styles['CorpsTexte']))

        # 4.4 Espace Administrateur
        self.elements.append(Paragraph("4.4 Espace Administrateur", self.styles['SectionTitle']))

        admin_text = """
        L'espace administrateur offre une vue globale et des outils de gestion du système.<br/><br/>

        <b>4.4.1 Tableau de bord Administrateur</b><br/><br/>

        <b>[Figure 26 : Tableau de bord Administrateur - Insérer capture d'écran ici]</b><br/><br/>

        <b>Vue d'ensemble :</b><br/>
        • Nombre total de patients<br/>
        • Nombre total de médecins<br/>
        • Rendez-vous du jour<br/>
        • Rendez-vous en attente de confirmation<br/>
        • Médecins en attente de validation<br/><br/>

        <b>Graphiques :</b><br/>
        • Évolution des inscriptions<br/>
        • Répartition des RDV par spécialité<br/>
        • Taux de RDV honorés vs annulés<br/><br/>

        <b>4.4.2 Gestion des utilisateurs</b><br/><br/>

        <b>[Figure 27 : Gestion des utilisateurs - Insérer capture d'écran ici]</b><br/><br/>

        <b>Gestion des patients :</b><br/>
        • Liste complète avec pagination<br/>
        • Recherche et filtres<br/>
        • Activation/désactivation de comptes<br/>
        • Consultation des détails<br/><br/>

        <b>Gestion des médecins :</b><br/>
        • Liste avec statut de validation<br/>
        • Workflow de validation : PENDING → APPROVED/REJECTED<br/>
        • Modification des informations<br/>
        • Gestion des spécialités<br/><br/>

        <b>4.4.3 Statistiques avancées</b><br/><br/>

        <b>[Figure 28 : Statistiques avancées - Insérer capture d'écran ici]</b><br/><br/>

        <b>Indicateurs clés (KPI) :</b><br/>
        • Nombre total de RDV<br/>
        • Taux de RDV confirmés<br/>
        • Taux d'annulation<br/>
        • Temps moyen de confirmation<br/>
        • Médecin le plus consulté<br/>
        • Spécialité la plus demandée<br/><br/>

        <b>Graphiques interactifs :</b><br/>
        • Courbe d'évolution mensuelle<br/>
        • Histogramme par spécialité<br/>
        • Camembert de répartition<br/><br/>

        <b>4.4.4 Journaux d'audit</b><br/><br/>

        <b>[Figure 29 : Journaux d'audit - Insérer capture d'écran ici]</b><br/><br/>

        <b>Informations tracées :</b><br/>
        • Actions effectuées (login, création, modification, suppression)<br/>
        • Utilisateur concerné<br/>
        • Date et heure<br/>
        • Adresse IP<br/>
        • Statut (succès, échec)<br/>
        • Entité impactée<br/><br/>

        <b>Fonctionnalités :</b><br/>
        • Recherche par utilisateur, action, date<br/>
        • Filtres multiples<br/>
        • Pagination<br/>
        • Export (prévu)<br/><br/>

        <b>4.4.5 Paramètres système</b><br/><br/>

        <b>[Figure 30 : Paramètres système - Insérer capture d'écran ici]</b><br/><br/>

        <b>Paramètres configurables :</b><br/>
        • Gestion des spécialités médicales<br/>
        • Paramètres de notifications globales<br/>
        • Configuration du thème par défaut<br/>
        • Paramètres de sauvegarde<br/>
        """

        self.elements.append(Paragraph(admin_text, self.styles['CorpsTexte']))
        self.elements.append(PageBreak())

    def add_chapter5(self):
        """Chapitre 5 : Tests et déploiement"""
        self.elements.append(Paragraph("CHAPITRE 5 : TESTS ET DÉPLOIEMENT", self.styles['ChapterTitle']))

        # 5.1 Stratégie de tests
        self.elements.append(Paragraph("5.1 Stratégie de tests", self.styles['SectionTitle']))

        tests_text = """
        <b>5.1.1 Types de tests réalisés</b><br/><br/>

        <b>Tests unitaires :</b><br/>
        Les services backend ont été testés individuellement pour vérifier leur bon fonctionnement. Les tests vérifient notamment :<br/>
        • La logique métier des services<br/>
        • Les validations de données<br/>
        • Les cas d'erreur<br/><br/>

        <b>Tests d'intégration :</b><br/>
        Les tests d'intégration vérifient le bon fonctionnement des modules ensemble :<br/>
        • Authentification complète (inscription, connexion, refresh)<br/>
        • Cycle de vie des rendez-vous<br/>
        • Système de notifications<br/><br/>

        <b>Tests manuels :</b><br/>
        Des tests manuels exhaustifs ont été réalisés sur l'ensemble des fonctionnalités :<br/>
        • Parcours utilisateur complets<br/>
        • Tests de responsive design<br/>
        • Tests cross-browser<br/><br/>

        <b>5.1.2 Comptes de test</b><br/><br/>
        """

        self.elements.append(Paragraph(tests_text, self.styles['CorpsTexte']))

        # Tableau des comptes de test
        self.elements.append(Paragraph("Tableau 11 : Comptes de test", self.styles['Caption']))

        test_accounts = [
            ["Rôle", "Email", "Mot de passe"],
            ["Admin", "admin@medical.com", "password123"],
            ["Médecin (Cardiologie)", "jean.kouadio@medical.com", "password123"],
            ["Médecin (Pédiatrie)", "sophie.kone@medical.com", "password123"],
            ["Médecin (Dermatologie)", "michel.traore@medical.com", "password123"],
            ["Patient", "marie.yao@example.com", "password123"],
            ["Patient", "kouassi.bamba@example.com", "password123"],
            ["Patient", "fatou.diallo@example.com", "password123"],
        ]

        test_table = Table(test_accounts, colWidths=[4*cm, 6*cm, 4*cm])
        test_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_COLOR),
            ('TEXTCOLOR', (0, 0), (-1, 0), white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 0.5, DARK_COLOR),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, LIGHT_COLOR]),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
        ]))
        self.elements.append(test_table)
        self.elements.append(Spacer(1, 0.5*cm))

        # Résultats des tests
        self.elements.append(Paragraph("Tableau 12 : Résultats des tests", self.styles['Caption']))

        results_data = [
            ["Fonctionnalité", "Statut", "Observations"],
            ["Inscription Patient", "✓ OK", "Validation complète fonctionnelle"],
            ["Inscription Médecin", "✓ OK", "Statut PENDING par défaut"],
            ["Connexion", "✓ OK", "Tokens JWT générés correctement"],
            ["Refresh Token", "✓ OK", "Renouvellement automatique"],
            ["Prise de RDV", "✓ OK", "Workflow complet testé"],
            ["Confirmation RDV", "✓ OK", "Seul médecin peut confirmer"],
            ["Annulation RDV", "✓ OK", "Patient et médecin peuvent annuler"],
            ["Notifications Email", "✓ OK", "Envoi via Nodemailer"],
            ["Notifications SMS", "✓ OK", "Envoi via Twilio"],
            ["Notes médicales", "✓ OK", "CRUD complet fonctionnel"],
            ["Créneaux horaires", "✓ OK", "Validation des chevauchements"],
            ["Validation médecin", "✓ OK", "Admin peut approuver/rejeter"],
            ["Statistiques", "✓ OK", "Calculs corrects"],
            ["Audit logs", "✓ OK", "Traçabilité complète"],
            ["Responsive", "✓ OK", "Mobile, tablette, desktop"],
            ["Mode sombre", "✓ OK", "Basculement sans rechargement"],
            ["Multilingue", "✓ OK", "FR/EN avec persistance"],
        ]

        results_table = Table(results_data, colWidths=[5*cm, 2*cm, 8*cm])
        results_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), SUCCESS_COLOR),
            ('TEXTCOLOR', (0, 0), (-1, 0), white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('ALIGN', (1, 0), (1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 0.5, DARK_COLOR),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, LIGHT_COLOR]),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
        ]))
        self.elements.append(results_table)

        # 5.2 Déploiement
        self.elements.append(Paragraph("5.2 Déploiement", self.styles['SectionTitle']))

        deploy_text = """
        <b>5.2.1 Infrastructure de déploiement</b><br/><br/>

        L'application est déployée sur la plateforme cloud Render, offrant :<br/>
        • Hébergement gratuit pour les petits projets<br/>
        • Déploiement automatique depuis GitHub<br/>
        • Support Docker<br/>
        • Base de données PostgreSQL managée<br/>
        • Certificat SSL automatique<br/><br/>

        <b>5.2.2 Configuration Docker</b><br/><br/>

        L'application utilise Docker pour le déploiement. Le Dockerfile combine le backend NestJS et le frontend React dans une seule image :<br/><br/>

        <b>Processus de build :</b><br/>
        1. Construction du frontend React (npm run build)<br/>
        2. Construction du backend NestJS<br/>
        3. Copie des fichiers statiques du frontend dans le répertoire public du backend<br/>
        4. Le backend NestJS sert les fichiers statiques du frontend<br/><br/>

        <b>5.2.3 Variables d'environnement</b><br/><br/>

        Les variables suivantes doivent être configurées :<br/>
        • DATABASE_URL : URL de connexion PostgreSQL<br/>
        • JWT_SECRET : Clé secrète pour les tokens<br/>
        • JWT_REFRESH_SECRET : Clé pour les refresh tokens<br/>
        • EMAIL_HOST, EMAIL_USER, EMAIL_PASS : Configuration SMTP<br/>
        • TWILIO_SID, TWILIO_TOKEN, TWILIO_PHONE : Configuration Twilio<br/><br/>

        <b>5.2.4 Procédure de déploiement</b><br/><br/>

        1. Push du code sur la branche main (GitHub)<br/>
        2. Render détecte le changement et lance le build<br/>
        3. Exécution des migrations Prisma<br/>
        4. Démarrage de l'application<br/>
        5. Vérification du health check<br/>
        """

        self.elements.append(Paragraph(deploy_text, self.styles['CorpsTexte']))

        # 5.3 Perspectives
        self.elements.append(Paragraph("5.3 Perspectives d'amélioration", self.styles['SectionTitle']))

        perspectives_text = """
        <b>5.3.1 Améliorations fonctionnelles</b><br/><br/>

        • <b>Téléconsultation</b> : Intégration de la visioconférence pour les consultations à distance<br/>
        • <b>Paiement en ligne</b> : Intégration d'un système de paiement (Orange Money, MTN Money, Visa)<br/>
        • <b>Rappels intelligents</b> : Rappels automatiques basés sur l'historique médical<br/>
        • <b>Ordonnances numériques</b> : Génération d'ordonnances signées électroniquement<br/>
        • <b>Dossier médical partagé</b> : Historique médical complet accessible par tous les praticiens<br/><br/>

        <b>5.3.2 Améliorations techniques</b><br/><br/>

        • <b>Application mobile</b> : Développement d'applications iOS et Android natives<br/>
        • <b>Notifications push</b> : Notifications en temps réel sur mobile<br/>
        • <b>Cache Redis</b> : Amélioration des performances avec mise en cache<br/>
        • <b>Tests automatisés</b> : Couverture de tests à 80%+<br/>
        • <b>CI/CD</b> : Pipeline d'intégration et déploiement continus<br/><br/>

        <b>5.3.3 Sécurité renforcée</b><br/><br/>

        • <b>2FA</b> : Authentification à deux facteurs obligatoire pour les médecins<br/>
        • <b>Chiffrement des données</b> : Chiffrement au repos des données sensibles<br/>
        • <b>Audit de sécurité</b> : Pentest régulier par des experts<br/>
        • <b>Conformité RGPD</b> : Mise en conformité complète avec le règlement européen<br/>
        """

        self.elements.append(Paragraph(perspectives_text, self.styles['CorpsTexte']))
        self.elements.append(PageBreak())

    def add_conclusion(self):
        """Conclusion générale"""
        self.elements.append(Paragraph("CONCLUSION GÉNÉRALE", self.styles['ChapterTitle']))

        conclusion_text = """
        <b>Bilan du projet</b><br/><br/>

        Ce projet de fin d'études nous a permis de concevoir et de réaliser une application web complète de gestion des rendez-vous médicaux avec système de notifications. L'application répond aux besoins identifiés lors de l'analyse, offrant une solution moderne et efficace pour la prise de rendez-vous médicaux en Côte d'Ivoire.<br/><br/>

        <b>Objectifs atteints</b><br/><br/>

        Les objectifs initiaux ont été largement atteints :<br/><br/>

        ✓ <b>Interface intuitive</b> : L'application offre une expérience utilisateur fluide et moderne, accessible à tous les profils d'utilisateurs.<br/><br/>

        ✓ <b>Prise de rendez-vous en ligne</b> : Les patients peuvent facilement prendre, modifier ou annuler leurs rendez-vous 24h/24.<br/><br/>

        ✓ <b>Gestion médicale efficace</b> : Les médecins disposent d'outils complets pour gérer leur planning, leurs patients et leurs notes médicales.<br/><br/>

        ✓ <b>Système de notifications</b> : Les notifications par email et SMS garantissent une communication efficace et réduisent les rendez-vous manqués.<br/><br/>

        ✓ <b>Administration centralisée</b> : Les administrateurs peuvent superviser l'ensemble du système et gérer les utilisateurs.<br/><br/>

        ✓ <b>Sécurité</b> : L'authentification JWT, le hashage des mots de passe et le contrôle d'accès par rôles garantissent la sécurité des données.<br/><br/>

        <b>Compétences acquises</b><br/><br/>

        Ce projet nous a permis de développer et renforcer de nombreuses compétences :<br/><br/>

        • <b>Développement Frontend</b> : Maîtrise de React.js, Tailwind CSS, gestion d'état, routage<br/>
        • <b>Développement Backend</b> : Architecture NestJS, API REST, TypeScript, ORM Prisma<br/>
        • <b>Base de données</b> : Conception, modélisation et manipulation avec PostgreSQL<br/>
        • <b>Sécurité</b> : Authentification JWT, hashage, protection des données<br/>
        • <b>DevOps</b> : Docker, déploiement cloud, variables d'environnement<br/>
        • <b>Méthodologie</b> : Analyse UML, conception orientée objet, approche agile<br/><br/>

        <b>Difficultés rencontrées</b><br/><br/>

        Plusieurs défis ont été relevés durant ce projet :<br/><br/>

        • La gestion de l'authentification avec refresh tokens<br/>
        • La synchronisation entre frontend et backend<br/>
        • La gestion des créneaux horaires sans chevauchement<br/>
        • L'optimisation des performances pour les listes volumineuses<br/>
        • L'internationalisation complète de l'application<br/><br/>

        <b>Perspectives</b><br/><br/>

        L'application peut être étendue avec de nouvelles fonctionnalités telles que la téléconsultation, le paiement en ligne, une application mobile native, ou encore un dossier médical partagé. Ces évolutions permettraient de proposer une solution encore plus complète répondant aux besoins croissants de la e-santé en Côte d'Ivoire.<br/><br/>

        <b>Conclusion</b><br/><br/>

        En définitive, ce projet a été une expérience enrichissante qui nous a permis de mettre en pratique les connaissances acquises durant notre formation tout en découvrant de nouvelles technologies. L'application développée représente une contribution concrète à l'amélioration de l'accès aux soins de santé grâce aux technologies de l'information.
        """

        self.elements.append(Paragraph(conclusion_text, self.styles['CorpsTexte']))
        self.elements.append(PageBreak())

    def add_bibliography(self):
        """Bibliographie et webographie"""
        self.elements.append(Paragraph("BIBLIOGRAPHIE ET WEBOGRAPHIE", self.styles['ChapterTitle']))

        biblio_text = """
        <b>Ouvrages et articles</b><br/><br/>

        [1] GAMMA E., HELM R., JOHNSON R., VLISSIDES J., <i>Design Patterns: Elements of Reusable Object-Oriented Software</i>, Addison-Wesley, 1994.<br/><br/>

        [2] FOWLER M., <i>Patterns of Enterprise Application Architecture</i>, Addison-Wesley, 2002.<br/><br/>

        [3] ROQUES P., <i>UML 2 par la pratique</i>, 7e édition, Eyrolles, 2011.<br/><br/>

        [4] BANKS A., PORCELLO E., <i>Learning React: Modern Patterns for Developing React Apps</i>, O'Reilly Media, 2020.<br/><br/>

        [5] KAMINSKI M., <i>NestJS: A Progressive Node.js Framework</i>, Packt Publishing, 2021.<br/><br/>

        <b>Documentation officielle</b><br/><br/>

        [6] React Documentation, <i>https://react.dev/</i>, consulté en 2024.<br/><br/>

        [7] NestJS Documentation, <i>https://docs.nestjs.com/</i>, consulté en 2024.<br/><br/>

        [8] Prisma Documentation, <i>https://www.prisma.io/docs</i>, consulté en 2024.<br/><br/>

        [9] Tailwind CSS Documentation, <i>https://tailwindcss.com/docs</i>, consulté en 2024.<br/><br/>

        [10] PostgreSQL Documentation, <i>https://www.postgresql.org/docs/</i>, consulté en 2024.<br/><br/>

        [11] JWT.io, <i>https://jwt.io/introduction</i>, consulté en 2024.<br/><br/>

        <b>Ressources en ligne</b><br/><br/>

        [12] MDN Web Docs, <i>https://developer.mozilla.org/</i>, consulté en 2024.<br/><br/>

        [13] Stack Overflow, <i>https://stackoverflow.com/</i>, consulté en 2024.<br/><br/>

        [14] GitHub, <i>https://github.com/</i>, consulté en 2024.<br/><br/>

        [15] Render Documentation, <i>https://render.com/docs</i>, consulté en 2024.<br/><br/>

        <b>Tutoriels et cours</b><br/><br/>

        [16] Traversy Media, <i>React Crash Course</i>, YouTube, 2023.<br/><br/>

        [17] Academind, <i>NestJS Complete Course</i>, Udemy, 2023.<br/><br/>

        [18] The Net Ninja, <i>Tailwind CSS Tutorial</i>, YouTube, 2023.<br/><br/>
        """

        self.elements.append(Paragraph(biblio_text, self.styles['CorpsTexte']))
        self.elements.append(PageBreak())

    def add_annexes(self):
        """Annexes"""
        self.elements.append(Paragraph("ANNEXES", self.styles['ChapterTitle']))

        annexes_text = """
        <b>Annexe A : Schéma complet de la base de données (Prisma)</b><br/><br/>

        Le schéma Prisma complet définit les modèles suivants :<br/>
        • User (avec tous les champs et relations)<br/>
        • RendezVous<br/>
        • TimeSlot<br/>
        • NoteMedicale<br/>
        • Notification<br/>
        • MedecinIndisponibilite<br/>
        • AuditLog<br/><br/>

        <i>Le fichier schema.prisma complet est disponible dans le code source du projet.</i><br/><br/>

        <b>Annexe B : Configuration du fichier .env</b><br/><br/>

        Variables d'environnement requises pour le backend :<br/><br/>
        """

        self.elements.append(Paragraph(annexes_text, self.styles['CorpsTexte']))

        env_config = """
        # Base de données
        DATABASE_URL="postgresql://user:password@localhost:5432/medical_db"

        # JWT
        JWT_SECRET="votre_secret_jwt_très_long_et_sécurisé"
        JWT_REFRESH_SECRET="votre_secret_refresh_très_long"

        # Email (Nodemailer)
        EMAIL_HOST="smtp.gmail.com"
        EMAIL_PORT=587
        EMAIL_USER="votre_email@gmail.com"
        EMAIL_PASS="votre_mot_de_passe_app"

        # Twilio (SMS)
        TWILIO_ACCOUNT_SID="ACxxxxxxxxxx"
        TWILIO_AUTH_TOKEN="votre_token"
        TWILIO_PHONE_NUMBER="+1234567890"

        # Application
        PORT=3002
        NODE_ENV=production
        """

        self.elements.append(Paragraph(f"<font face='Courier' size='9'><pre>{env_config}</pre></font>", self.styles['CodeBlock']))

        annexes_text2 = """
        <br/><b>Annexe C : Commandes utiles</b><br/><br/>

        <b>Backend (medical-appointment-api) :</b><br/>
        """

        self.elements.append(Paragraph(annexes_text2, self.styles['CorpsTexte']))

        backend_commands = """
        # Installation des dépendances
        npm install

        # Générer le client Prisma
        npx prisma generate

        # Exécuter les migrations
        npx prisma migrate dev

        # Peupler la base avec les données de test
        npx prisma db seed

        # Lancer en mode développement
        npm run start:dev

        # Lancer en mode production
        npm run start:prod

        # Lancer les tests
        npm run test
        """

        self.elements.append(Paragraph(f"<font face='Courier' size='9'><pre>{backend_commands}</pre></font>", self.styles['CodeBlock']))

        frontend_text = """
        <br/><b>Frontend (medical-appointment-frontend) :</b><br/>
        """

        self.elements.append(Paragraph(frontend_text, self.styles['CorpsTexte']))

        frontend_commands = """
        # Installation des dépendances
        npm install

        # Lancer en mode développement
        npm start

        # Build pour la production
        npm run build

        # Lancer les tests
        npm test
        """

        self.elements.append(Paragraph(f"<font face='Courier' size='9'><pre>{frontend_commands}</pre></font>", self.styles['CodeBlock']))

        final_note = """
        <br/><br/>
        <b>Annexe D : Structure des réponses API</b><br/><br/>

        Toutes les réponses de l'API suivent un format standardisé :<br/><br/>

        <b>Succès :</b><br/>
        { "statusCode": 200, "data": { ... }, "message": "Opération réussie" }<br/><br/>

        <b>Erreur :</b><br/>
        { "statusCode": 400/401/403/404/500, "message": "Description de l'erreur", "error": "Type d'erreur" }<br/><br/>

        <b>Annexe E : Guide d'installation rapide</b><br/><br/>

        1. Cloner le dépôt GitHub<br/>
        2. Installer PostgreSQL et créer la base de données<br/>
        3. Configurer les fichiers .env (backend et frontend)<br/>
        4. Installer les dépendances (npm install) dans les deux dossiers<br/>
        5. Exécuter les migrations Prisma<br/>
        6. Lancer le seed pour les données de test<br/>
        7. Démarrer le backend (port 3002)<br/>
        8. Démarrer le frontend (port 3000)<br/>
        9. Accéder à l'application : http://localhost:3000<br/>
        """

        self.elements.append(Paragraph(final_note, self.styles['CorpsTexte']))

    def generate(self):
        """Génère le document PDF complet"""
        doc = SimpleDocTemplate(
            self.filename,
            pagesize=A4,
            rightMargin=2*cm,
            leftMargin=2*cm,
            topMargin=2*cm,
            bottomMargin=2*cm
        )

        # Ajout de toutes les sections
        self.add_cover_page()
        self.add_table_of_contents()
        self.add_list_of_figures()
        self.add_list_of_tables()
        self.add_introduction()
        self.add_chapter1()
        self.add_chapter2()
        self.add_chapter3()
        self.add_chapter4()
        self.add_chapter5()
        self.add_conclusion()
        self.add_bibliography()
        self.add_annexes()

        # Construction du document
        doc.build(self.elements)
        print(f"✅ Mémoire généré avec succès : {self.filename}")


if __name__ == "__main__":
    output_path = "/Users/afsa/Desktop/projet_memoire/Fichiers/memoire_final.pdf"
    generator = MemoireGenerator(output_path)
    generator.generate()
