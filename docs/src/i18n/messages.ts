import type { DocGroup } from '@/content/types';
import type { Locale } from './locales';

export interface Messages {
  htmlLang: string;
  languageName: string;
  switchLanguage: string;
  brand: string;
  nav: {
    docs: string;
    install: string;
    changelog: string;
    github: string;
    menu: string;
    home: string;
  };
  search: {
    placeholder: string;
    label: string;
    empty: string;
    pages: string;
    sections: string;
    hintNavigate: string;
    hintOpen: string;
    hintClose: string;
  };
  groups: Record<DocGroup, string>;
  docs: {
    onThisPage: string;
    previous: string;
    next: string;
    editOnGithub: string;
  };
  code: {
    copy: string;
    copied: string;
    failed: string;
  };
  notFound: {
    title: string;
    body: string;
    back: string;
  };
  footer: {
    license: string;
    source: string;
    createdBy: string;
    docs: string;
    project: string;
    language: string;
  };
}

export const messages: Record<Locale, Messages> = {
  pt: {
    htmlLang: 'pt-BR',
    languageName: 'Português',
    switchLanguage: 'Read in English',
    brand: 'Emulator in VS Code Panel',
    nav: {
      docs: 'Docs',
      install: 'Instalar',
      changelog: 'Changelog',
      github: 'GitHub',
      menu: 'Abrir navegação',
      home: 'Início',
    },
    search: {
      placeholder: 'Buscar na documentação…',
      label: 'Buscar (⌘K)',
      empty: 'Nada encontrado.',
      pages: 'Páginas',
      sections: 'Seções',
      hintNavigate: 'navegar',
      hintOpen: 'abrir',
      hintClose: 'fechar',
    },
    groups: {
      start: 'Começar',
      reference: 'Referência',
      internals: 'Por dentro',
      project: 'Projeto',
    },
    docs: {
      onThisPage: 'Nesta página',
      previous: 'Anterior',
      next: 'Próxima',
      editOnGithub: 'Editar no GitHub',
    },
    code: {
      copy: 'Copiar',
      copied: 'Copiado',
      failed: 'Falhou',
    },
    notFound: {
      title: 'Página não encontrada.',
      body: 'O endereço não existe ou mudou de lugar.',
      back: 'Voltar para o início',
    },
    footer: {
      license: 'Licença MIT',
      source: 'Código no GitHub',
      createdBy: 'Criado por',
      docs: 'Documentação',
      project: 'Projeto',
      language: 'Idioma',
    },
  },
  en: {
    htmlLang: 'en',
    languageName: 'English',
    switchLanguage: 'Ler em português',
    brand: 'Emulator in VS Code Panel',
    nav: {
      docs: 'Docs',
      install: 'Install',
      changelog: 'Changelog',
      github: 'GitHub',
      menu: 'Open navigation',
      home: 'Home',
    },
    search: {
      placeholder: 'Search the docs…',
      label: 'Search (⌘K)',
      empty: 'No results.',
      pages: 'Pages',
      sections: 'Sections',
      hintNavigate: 'navigate',
      hintOpen: 'open',
      hintClose: 'close',
    },
    groups: {
      start: 'Get started',
      reference: 'Reference',
      internals: 'Internals',
      project: 'Project',
    },
    docs: {
      onThisPage: 'On this page',
      previous: 'Previous',
      next: 'Next',
      editOnGithub: 'Edit on GitHub',
    },
    code: {
      copy: 'Copy',
      copied: 'Copied',
      failed: 'Failed',
    },
    notFound: {
      title: 'Page not found.',
      body: 'This address does not exist or has moved.',
      back: 'Back to home',
    },
    footer: {
      license: 'MIT license',
      source: 'Source on GitHub',
      createdBy: 'Created by',
      docs: 'Documentation',
      project: 'Project',
      language: 'Language',
    },
  },
};
